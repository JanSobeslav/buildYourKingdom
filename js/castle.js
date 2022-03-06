import { displayBuildTime, createElement, getElement } from "./glMethods.js";
import { buildNavigation as nav } from "./navigation.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    bindDisplayBuildings(callback) {
        this.onDisplayBuildings(callback);
    }

    bindActiveBuildState(state, building) {
        this.settings.activeBuildState = state;
        this.settings.buildingUpgradingState = building;
    }

    bindFinishTimeState(time, link) {
        const index = this.data.findIndex(b => b.link === link);
        if (time !== "") {
            let date = new Date();
            date.setSeconds(date.getSeconds() + time);
            this.data[index].finishDateTime = date;
        } else {
            this.data[index].finishDateTime = "";
        }
    }

    bindDicreaseGold(gold) {
        this.settings.gold -= gold;
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.container = createElement('div', ['container-fluid', 'px-4']);
        this.container.id = "container-castle";

        this.h1 = createElement('h1', ['mt-4']);

        //NEFUNKČNÍ
        this.infoButton = createElement('button');
        this.infoButton.setAttribute('type', 'button');
        this.infoButton.setAttribute('data-bs-container', 'body');
        this.infoButton.setAttribute('data-bs-toggle', 'popover');
        this.infoButton.setAttribute('data-bs-placement', 'right');
        this.infoButton.setAttribute('style', 'background-color: transparent; border: solid transparent;');
        this.infoButton.setAttribute('data-bs-content', ('Hrad je místo, odkud řídíš své město. Především tu stavíš a vylepšuješ' +
            'budovy, ale také máš možnost zde vidět svůj postup. Kolik si rekrutoval jednotek, kolik stupňů budov postavil,' +
            'kolik zlata jsi vytěžil, nebo kolik mincí si vyrazil.'));
        this.infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';

        this.nav = createElement('nav');

        this.navTabs = createElement('div', ['nav', 'nav-tabs']);

        this.navTabsBtnBuild = createElement('button', ['nav-link', 'active']);
        this.navTabsBtnBuild.id = 'nav-buildings-tab';
        this.navTabsBtnBuild.textContent = 'Budovy';
        this.navTabsBtnBuild.setAttribute('data-bs-toggle', 'tab');
        this.navTabsBtnBuild.setAttribute('data-bs-target', '#nav-buildings');
        this.navTabsBtnBuild.setAttribute('type', 'button');
        this.navTabsBtnBuild.setAttribute('role', 'tab');
        this.navTabsBtnBuild.setAttribute('aria-controls', 'nav-buildings');
        this.navTabsBtnBuild.setAttribute('aria-selected', 'true');

        this.navTabsBtnProgress = createElement('button', ['nav-link']);
        this.navTabsBtnProgress.id = 'nav-progress-tab';
        this.navTabsBtnProgress.textContent = 'Postup';
        this.navTabsBtnProgress.setAttribute('data-bs-toggle', 'tab');
        this.navTabsBtnProgress.setAttribute('data-bs-target', '#nav-progress');
        this.navTabsBtnProgress.setAttribute('type', 'button');
        this.navTabsBtnProgress.setAttribute('role', 'tab');
        this.navTabsBtnProgress.setAttribute('aria-controls', 'nav-progress');
        this.navTabsBtnProgress.setAttribute('aria-selected', 'true');

        this.navTabs.append(this.navTabsBtnBuild, this.navTabsBtnProgress);

        this.nav.append(this.navTabs);

        this.tabContent = createElement('div', ['tab-content']);
        this.tabContent.id = 'nav-tabContent';

        this.tabPane = createElement('div', ['tab-pane', 'fade', 'show', 'active']);
        this.tabPane.id = 'nav-buildings';
        this.tabPane.role = 'tabpanel';
        this.tabPane.setAttribute('aria-labelledby', 'nav-buildings-tab');

        this.tabPaneContBuildings = createElement('div', ['container', 'mt-4', 'ml-4']);

        //generuje se v displayBuildings

        this.tabPane.append(this.tabPaneContBuildings);

        this.tabPane2 = createElement('div', ['tab-pane', 'fade', 'show']);
        this.tabPane2.id = 'nav-progress';
        this.tabPane2.role = 'tabpanel';
        this.tabPane2.setAttribute('aria-labelledby', 'nav-progress-tab');
        this.tabPane2.textContent = '--- Coming Soon! ---';

        this.tabContent.append(this.tabPane, this.tabPane2);

        this.container.append(this.h1, this.infoButton, this.nav, this.tabContent);

        this.app.append(this.container);
    }

    displayBuildings(activeBuildStateHandler, finishTimeHandler, dicreaseGoldHandler, data, settings) {
        let i = data.findIndex(data => data.link === 'castle');
        this.h1.textContent = data[i].name;
        let tpcRowHeader = createElement('div', ['row', 'justify-content-around', 'mb-4']);
        tpcRowHeader.innerHTML = `
        <div class="col-2">
            <b>Budova</b>
        </div>
        <div class="col-2">
            <b>Stupeň budovy</b>
        </div>
        <div class="col-2">
            <b>Cena dalšího stupně</b>
        </div>
        <div class="col-2">
            <b>Čas pro stavbu</b>
        </div>
        <div class="col-2">
            <b>Vylepšit</b>
        </div>
        `;
        this.tabPaneContBuildings.append(tpcRowHeader);
        let castleLevel = 0;
        for (let budova of data) {
            let row = createElement('div', ['row', 'justify-content-around', 'mb-2']);
            if (budova.link === 'castle') castleLevel = budova.level;
            row.innerHTML = `
            <div class="col-2">
                <i class="${budova.icon}"></i> ${budova.name}
            </div>
            <div class="col-2">
                ${budova.level}
            </div>
            <div class="col-2">
                ${budova.priceGold} <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> /
                ${budova.priceCoins} <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i>
            </div>
            <div class="col-2" id="time-${budova.link}">
                ${displayBuildTime((budova.time * Math.pow(budova.level > 0 ? budova.level : budova.level + 1, 3) - Math.pow(castleLevel, 3)))}
            </div>
            <div class="col-2">
                <button id="level-${budova.link}" ${settings.activeBuildState && 'disabled'} class="btn btn-primary upgrade">
                ${(budova.level == 0 && settings.activeBuildState == false) ? 'Postavit' : ((settings.activeBuildState && settings.buildingUpgradingState == budova.link) ? 'Level ' + (budova.level + 2) : 'Level ' + (budova.level + 1))}</button>
            </div>
            `;
            this.tabPaneContBuildings.append(row);

            document.getElementById("level-" + budova.link).addEventListener('click', () => {
                if (budova.priceGold < settings.gold) {
                    dicreaseGoldHandler(budova.priceGold);

                    getElement('#game-navigation').innerHTML = '';
                    nav('#game-navigation', {data: data, settings: settings});

                    activeBuildStateHandler(true, budova.link);

                    let btnLevel = getElement('#level-' + budova.link);
                    let btnsLevel = document.getElementsByClassName('upgrade');

                    for (const btn of btnsLevel) {
                        btn.disabled = true;
                    }

                    btnLevel.innerHTML = `Level ${budova.level + 2}`;

                    let time = budova.time * Math.pow(budova.level > 0 ? budova.level : budova.level + 1, 3) - Math.pow(castleLevel, 3);
                    finishTimeHandler(time, budova.link);

                    const countdown = setInterval(() => {
                        let bTime = displayBuildTime(time, budova.finishDateTime);
                        let timeElement = getElement('#time-' + budova.link);

                        if (timeElement) timeElement.innerHTML = `<strong style="color: darkgreen;">${bTime}</strong>`;

                        if (bTime == "Stavba dokončena") {
                            budova.level++;
                            activeBuildStateHandler(false, "");
                            finishTimeHandler("", budova.link);
                            clearInterval(countdown);
                            this.app.innerHTML = "";
                            buildCastle('#content', { data: data, settings: settings });
                        }
                    }, 100);
                } else {
                    let timeEl = getElement('#time-' + budova.link);
                    timeEl.innerHTML = `<span style="color: red">Nemáš dostatek surovin!</span>`;
                    setTimeout(() => {
                        timeEl.innerHTML = displayBuildTime((budova.time * Math.pow(budova.level > 0 ? budova.level : budova.level + 1, 3) - Math.pow(castleLevel, 3)));
                    }, 5000);
                }

            });
        }

    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.onDisplayBuildings(
            this.handleActiveBuildState, 
            this.finishTimeHandler, 
            this.handleDecreaseGold, 
            this.model.data, 
            this.model.settings);
    }

    onDisplayBuildings = (activeBuildStateHandler, finishTimeHandler, dicreaseGoldHandler, data, settings) => {
        this.view.displayBuildings(activeBuildStateHandler, finishTimeHandler, dicreaseGoldHandler, data, settings);
    }

    handleActiveBuildState = (state, building) => {
        this.model.bindActiveBuildState(state, building);
    }

    finishTimeHandler = (dateTime, link) => {
        this.model.bindFinishTimeState(dateTime, link);
    }

    handleDecreaseGold = gold => {
        this.model.bindDicreaseGold(gold);
    }
}

export function buildCastle(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}