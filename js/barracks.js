import { displayBuildTime, createElement, getElement, save } from "./glFunctions.js";
import { buildDialog as dialog } from "./dialog.js";
import { buildNavigation as nav } from "./navigation.js";
import { getData } from "./data.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    displayUnits(callback) {
        this.handleDisplayUnits(callback);
    }

    changeRecruitState(state, link,  unitLink) {
        this.settings.activeRecruitState = state;
        this.settings.recruitingUpgradingState = link;
        const indexBarracks = this.data.findIndex(b => b.link === 'barracks');
        const indexUnit = this.data[indexBarracks].soldiers_type.findIndex(u => u.link === unitLink);
        this.data[indexBarracks].soldiers_type[indexUnit].finishDateTime = null;
        save({ data: this.data, settings: this.settings });
    }

    addArmy(count, type) {
        const [barracks] = this.data.filter(b => b.link === 'barracks');
        const [unit] = barracks.soldiers_type.filter(s => s.link === type);
        switch (type) {
            case 'swordsman':
                this.settings.army.swordsmans += count;
                break;
            case 'archer':
                this.settings.army.archers += count;
                break;
            case 'horseman':
                this.settings.army.horsemans += count;
                break;
        }
        save({ data: this.data, settings: this.settings });
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.container = createElement('div', ['container-fluid', 'px-4']);
        this.container.id = "barracks-cont";

        this.h1Title = createElement('h1', ['mt-4', 'mb-4']);
        this.infoButton = createElement('button');
        this.infoButton.setAttribute('style', 'background-color: transparent; border: solid transparent; cursor: help;');
        this.infoButton.setAttribute('title', ('V kasárnách můžeš rekrutovat nové jednotky a připravit se tak na těžké časy, které mohou nastat.'));
        this.infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';
        this.hr = createElement('hr');

        this.content = createElement('div');
        this.content.id = "army-table";

        this.contentHead = createElement('div', ['row', 'justify-content-around', 'mb-4']);
        this.contentHead.innerHTML = `
            <div class="col-2">
                <b>Jednotka</b>
            </div>
            <div class="col-2">
                <b>Aktuální počet</b>
            </div>
            <div class="col-2">
                <b>Náklady / 1</b>
            </div>
            <div class="col-2">
                <b>Čas rekrutace / 1</b>
            </div>
            <div class="col-2">
                <b>Útok/Obrana</b>
            </div>
            <div class="col-2">
                <b>Rekrutace</b>
            </div>`;

        //výpis jednotek

        this.content.append(this.contentHead);
        this.container.append(this.h1Title, this.infoButton, this.hr, this.content);
        this.modal = createElement('div');
        this.modal.id = "modal-container";

        this.app.append(this.container, this.modal);
    }

    bindDisplayUnits(data, settings, activeRecruitStateHandler, addToArmy) {
        let i = data.findIndex(data => data.link === 'barracks');
        this.h1Title.innerHTML = data[i].name;
        for (const unit of data[i].soldiers_type) {
            let disTime = unit.time - (Math.pow(data[i].level, 2));
            let row = createElement('div', ['row', 'justify-content-around', 'mb-2']);
            row.innerHTML = `
            <div class="col-2">
                <i class="${unit.icon}"></i> ${unit.name}
            </div>
            <div class="col-2">
            ${unit.link == 'swordsman' ? settings.army.swordsmans : ''}
            ${unit.link == 'archer' ? settings.army.archers : ''}
            ${unit.link == 'horseman' ? settings.army.horsemans : ''}  
            </div >
            <div class="col-2">
            ${unit.priceGold} <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> /
            ${Math.ceil(unit.priceGold / 10)} <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i>
            </div>
            <div class="col-2" id="recruitTime-${unit.link}">
                ${displayBuildTime(disTime)}
            </div>
            <div class="col-2">
                <span>${unit.attack}/${unit.defence}</span>
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-primary" ${settings.activeRecruitState && 'disabled'} id="${'recruit-' + unit.link}">
                    Rekrutovat
                </button>
            </div>
        `;
            this.content.append(row);

            document.getElementById("recruit-" + unit.link).addEventListener('click', () => {
                this.modal.innerHTML = '';
                dialog("#modal-container", { data: data, settings: settings }, unit);
            });
            if (settings.activeRecruitState && settings.recruitingUpgradingState === unit.link) {
                const interval = setInterval(() => {
                    let bTime = displayBuildTime(0, unit.finishDateTime);
                    let timeElement = getElement('#recruitTime-' + unit.link);
                    if (timeElement) timeElement.innerHTML = `<strong style="color: darkgreen;">${bTime}</strong>`;

                    if (bTime == "Dokončeno") {
                        activeRecruitStateHandler(false, "", unit.link);
                        addToArmy(unit.inProccess, unit.link);
                        clearInterval(interval);
                        timeElement.innerHTML = '';
                        if (settings.activeLink === 'barracks') {
                            getElement('#content').innerHTML = '';
                            buildBarracks('#content', { data, settings });
                        }
                        getElement('#game-navigation').innerHTML = '';
                        nav('#game-navigation', { data, settings });
                    }
                }, 100);
            }
        }
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.handleDisplayUnits(this.model.data, this.model.settings, this.handleRecruitState, this.handleAddArmy);

    }

    handleDisplayUnits = (data, settings, activeRecruitStateHandler, addArmy) => {
        this.view.bindDisplayUnits(data, settings, activeRecruitStateHandler, addArmy);
    }

    handleRecruitState = (state, building, unitLink) => {
        this.model.changeRecruitState(state, building, unitLink);
    }

    handleAddArmy = (count, unit_type) => {
        this.model.addArmy(count, unit_type);
    }

}

export function buildBarracks(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}