import { displayBuildTime, createElement, getElement, save } from "./glFunctions.js";
import { buildNavigation as nav } from "./navigation.js";
import { buildEventAttack as eventAttack } from "./eventAttack.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    displayBuildings(callback) {
        this.handleDisplayBuildings(callback);
    }

    changeBuildState(state, building) {
        this.settings.activeBuildState = state;
        this.settings.buildingUpgradingState = building;
        save({ data: this.data, settings: this.settings });
    }

    changeFinishTimeState(time, link) {
        const index = this.data.findIndex(b => b.link === link);
        if (time) {
            let date = new Date();
            date.setSeconds(date.getSeconds() + time);
            this.data[index].finishDateTime = date;
        } else {
            this.data[index].finishDateTime = "";
        }
        save({ data: this.data, settings: this.settings });
    }

    decreaseGold(gold) {
        this.settings.gold -= gold;
        save({ data: this.data, settings: this.settings });
    }

    decreaseCoins(coins) {
        this.settings.coins -= coins;
        save({ data: this.data, settings: this.settings });
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.container = createElement('div', ['container-fluid', 'px-4']);
        this.container.id = "container-castle";

        this.h1 = createElement('h1', ['mt-4']);

        this.infoButton = createElement('button');
        this.infoButton.setAttribute('style', 'background-color: transparent; border: solid transparent; cursor: help;');
        this.infoButton.setAttribute('title', ('Hrad je místo, odkud řídíš své město. Především tu stavíš a vylepšuješ ' +
            'budovy, ale také máš možnost zde vidět svůj postup.'));
        this.infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';

        this.contentBuildings = createElement('div', ['container', 'mt-4', 'ml-4']);

        this.container.append(this.h1, this.infoButton, this.contentBuildings);

        this.app.append(this.container);
    }

    bindDisplayBuildings(activeBuildStateHandler, finishTimeHandler, decreaseGoldHandler, decreaseCoinsHandler, data, settings) {
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
            <b>Cena dalšího stupně</b><br>
            <input type="radio" name="flexRadioDefault" value="inputGold" id="inputGold" checked/>
                <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> /
                <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i>
                <input type="radio" name="flexRadioDefault" value="inputCoins" id="inputCoins" />
        </div>
        <div class="col-2">
            <b>Čas pro stavbu</b><br>
            <span id="errorMessage"></span>
        </div>
        <div class="col-2">
            <b>Vylepšit</b>
        </div>
        `;
        this.contentBuildings.append(tpcRowHeader);
        let castleLevel = 0;
        for (let budova of data) {
            let row = createElement('div', ['row', 'justify-content-around', 'mb-2']);
            const buildingCoinsCost = budova.level == 0 ? budova.priceCoins : Math.ceil(budova.priceGold / 10) * budova.level;
            const buildingGoldCost = budova.level == 0 ? budova.priceGold : budova.priceGold * budova.level;
            const buildingUpgradeTime = (budova.time * Math.pow(budova.level > 0 ? budova.level : budova.level + 1, 3) - Math.pow(castleLevel, 3))/settings.speedUp;

            if (budova.link === 'castle') castleLevel = budova.level;
            row.innerHTML = `
            <div class="col-2">
                <i class="${budova.icon}"></i> ${budova.name}
            </div>
            <div class="col-2">
                ${budova.level}
            </div>
            <div class="col-2">
                ${buildingGoldCost} <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> /
                ${buildingCoinsCost} <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i>
            </div>
            <div class="col-2" id="time-${budova.link}">
                ${displayBuildTime(buildingUpgradeTime)}
            </div>
            <div class="col-2">
                <button id="level-${budova.link}" ${settings.activeBuildState && 'disabled'} class="btn btn-primary upgrade">
                ${(budova.level == 0 && settings.activeBuildState == false) ? 'Postavit' : ((settings.activeBuildState && settings.buildingUpgradingState == budova.link) ? 'Level ' + (budova.level + 2) : 'Level ' + (budova.level + 1))}</button>
            </div>
            `;
            this.contentBuildings.append(row);

            const upgradeBtn = document.getElementById("level-" + budova.link);

            upgradeBtn.addEventListener('click', () => {
                let radioGold = getElement('#inputGold');
                let radioCoins = getElement('#inputCoins');
                if ((buildingGoldCost < settings.gold && radioGold.checked) || (buildingCoinsCost < settings.coins && radioCoins.checked)) {
                    radioGold.checked ? decreaseGoldHandler(buildingGoldCost) : decreaseCoinsHandler(buildingCoinsCost);
                    getElement('#game-navigation').innerHTML = '';
                    nav('#game-navigation', { data: data, settings: settings });

                    activeBuildStateHandler(true, budova.link);
                    finishTimeHandler(buildingUpgradeTime, budova.link);
                    upgrading(buildingUpgradeTime);
                } else {
                    let timeEl = getElement('#errorMessage');
                    if (radioGold.checked || radioCoins.checked) {
                        timeEl.innerHTML = `<span style="color: red">Nemáš zlato/mince!</span>`;
                        setTimeout(() => {
                            timeEl.innerHTML = displayBuildTime(buildingUpgradeTime);
                        }, 5000);
                    }
                }
            });
            if (settings.activeBuildState && settings.buildingUpgradingState === budova.link) upgrading();

            function upgrading(time = 0) {
                let btnLevel = getElement('#level-' + budova.link);
                let btnsLevel = document.getElementsByClassName('upgrade');

                for (const btn of btnsLevel) {
                    btn.disabled = true;
                }

                btnLevel.innerHTML = `Level ${budova.level + 2}`;

                const intervalUpgrading = setInterval(() => {
                    let bTime = displayBuildTime(time, budova.finishDateTime);
                    let timeElement = getElement('#time-' + budova.link);

                    if (timeElement) timeElement.innerHTML = `<strong style="color: darkgreen;">${bTime}</strong>`;

                    if (bTime == "Dokončeno") {
                        budova.level++;
                        activeBuildStateHandler(false, "");
                        finishTimeHandler(null, budova.link);
                        
                        clearInterval(intervalUpgrading);
                        if (settings.activeLink === 'castle') {
                            getElement('#content').innerHTML = '';
                            buildCastle('#content', { data, settings });
                        }
                        if (budova.link === 'barracks' && budova.level % 2 === 0 && settings.event_attack.attackState === false) {
                            settings.event_attack.attackState = true;
                            eventAttack('#root', { data, settings });
                        }
                    }
                }, 100);
            }
        }

    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.handleDisplayBuildings(
            this.handleActiveBuildState,
            this.handleFinishTime,
            this.handleDecreaseGold,
            this.handleDecreaseCoins,
            this.model.data,
            this.model.settings);
    }

    handleDisplayBuildings = (activeBuildStateHandler, finishTimeHandler, decreaseGoldHandler, decreaseCoinsHandler, data, settings) => {
        this.view.bindDisplayBuildings(activeBuildStateHandler, finishTimeHandler, decreaseGoldHandler, decreaseCoinsHandler, data, settings);
    }

    handleActiveBuildState = (state, building) => {
        this.model.changeBuildState(state, building);
    }

    handleFinishTime = (dateTime = null, link) => {
        this.model.changeFinishTimeState(dateTime, link);
    }

    handleDecreaseGold = gold => {
        this.model.decreaseGold(gold);
    }

    handleDecreaseCoins = coins => {
        this.model.decreaseCoins(coins);
    }
}

export function buildCastle(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}