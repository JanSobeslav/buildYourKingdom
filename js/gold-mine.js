import { createElement, getElement } from "./glFunctions.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    displayGoldMineData(callback) {
        this.handleDisplayGoldMineData(callback);
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.container = createElement('div', ['container-fluid', 'px-4']);

        this.h1Title = createElement('h1', ['mt-4', 'mb-4']);
        this.hr = createElement('hr');

        this.infoButton = createElement('button');
        this.infoButton.setAttribute('style', 'background-color: transparent; border: solid transparent; cursor: help;');
        this.infoButton.setAttribute('title', (`Ve tvém okolí se nachází zlatý důl, ve kterém těžíš zlaté valouny. Touto surovinou můžeš následně platit za stavbu budov či rekrutování jednotek. Pamatuj, že čím vyšší level dolu budeš mít tím vyšší počet zlata vytěžíš za hodinu.`));
        this.infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';

        this.actualLevel = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        this.acTitle = createElement('h5');
        this.acTitle.innerHTML = 'Těžba při <b>aktuálním</b> stupni budovy';

        this.acStatus = createElement('div', ['col']);

        this.actualLevel.append(this.acTitle, this.acStatus);

        this.nextLevel = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        this.nlTitle = createElement('h5');
        this.nlTitle.innerHTML = 'Těžba při <b>dalším</b> stupni budovy';

        this.nlStatus = createElement('div', ['col']);

        this.nextLevel.append(this.nlTitle, this.nlStatus);

        this.container.append(this.h1Title, this.infoButton, this.hr, this.actualLevel, this.nextLevel);

        this.app.append(this.container);
    }

    bindDisplayGoldMineData(data) {

        let i = data.findIndex(data => data.link === 'gold-mine');

        this.h1Title.textContent = data[i].name;

        this.acTitle.innerHTML += ` (Level ${data[i].level})`;
        this.acStatus.innerHTML += `
        Počet vytěženého zlata: <b>${1 * (Math.pow(data[i].level, 2))}</b> <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i> <b>/
        hodina</b>
        `;

        this.nlTitle.innerHTML += ` (Level ${data[i].level + 1})`;
        this.nlStatus.innerHTML += `
        Počet vytěženého zlata: <b style="color: darkgreen;">${1 * (Math.pow((data[i].level + 1) , 2))}</b> <i class="fas fa-circle"
        style="color: rgb(139, 126, 0);"></i> <b>/ hodina</b>
        `;
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.handleDisplayGoldMineData(this.model.data);
    }

    handleDisplayGoldMineData = (data) => {
        this.view.bindDisplayGoldMineData(data);
    }
}

export function buildGoldMine(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}