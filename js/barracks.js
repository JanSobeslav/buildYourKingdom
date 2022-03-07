import { displayBuildTime, createElement, getElement } from "./glMethods.js";
import { buildDialog as dialog } from "./dialog.js";
import { getData } from "./data.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    bindDisplayUnits(callback) {
        this.onDisplayUnits(callback);
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.container = createElement('div', ['container-fluid', 'px-4']);

        this.h1Title = createElement('h1', ['mt-4', 'mb-4']);
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
        this.container.append(this.h1Title, this.hr, this.content);
        this.modal = createElement('div');
        this.modal.id = "modal-container";

        this.app.append(this.container, this.modal);
    }

    displayUnits(data, settings) {
        let i = data.findIndex(data => data.link === 'barracks');
        this.h1Title.innerHTML = data[i].name;
        for (const unit of data[i].soldiers_type) {
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
                ${displayBuildTime(unit.time - (Math.pow(data[i].level, 2)))}
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
                dialog("#modal-container", {data: data, settings: settings}, unit);
            });
        }
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.onDisplayUnits(this.model.data, this.model.settings);

    }

    onDisplayUnits = (data, settings) => {
        this.view.displayUnits(data, settings);
    }
}

export function buildBarracks(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}