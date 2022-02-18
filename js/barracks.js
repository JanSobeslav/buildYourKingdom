import { createElement, getElement } from "./elements.js";

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

        this.app.append(this.container);
    }

    displayUnits(data) {
        let i = data.findIndex(data => data.link === 'barracks');
        this.h1Title.innerHTML = data[i].name;
        for (const unit of data[i].soldiers_type) {
            let row = createElement('div', ['row', 'justify-content-around', 'mb-2']);
            row.innerHTML = `
            <div class="col-2">
                <i class="${unit.icon}"></i> ${unit.name}
            </div>
            <div class="col-2">
                Aktuální počet
            </div>
            <div class="col-2">
            ${unit.priceGold} <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> /
            ${unit.priceCoins} <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i>
            </div>
            <div class="col-2">
                ${this.displayBuildTime(unit.time - (Math.pow(data[i].level, 2)))}
            </div>
            <div class="col-2">
                <span>${unit.attack}/${unit.defence}</span>
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#horseModal">
                    Rekrutovat
                </button>
            </div>
            `;
            this.content.append(row);
        }
    }

    displayBuildTime(t) {
        const sec = parseInt(t, 10); // convert value to number if it's string
    let hours   = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
    }

}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.onDisplayUnits(this.model.data);

    }

    onDisplayUnits = (data) => {
        this.view.displayUnits(data);
    }
}

export function buildBarracks(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}