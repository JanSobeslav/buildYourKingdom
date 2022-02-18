import { createElement, getElement } from "./elements.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    bindDisplayGoldMineData(callback) {
        this.onDisplayGoldMineData(callback);
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.container = createElement('div', ['container-fluid', 'px-4']);

        this.h1Title = createElement('h1', ['mt-4', 'mb-4']);
        this.hr = createElement('hr');

        // <button type="button" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right"
        // style="background-color: transparent; border: solid transparent;" data-bs-content="Ve tvém okolí se nachází zlatý důl, ve kterém těžíš zlaté valouny. 
        // Touto surovinou můžeš následně platit za stavbu budov či rekrutování jednotek. 
        // Pamatuj, že čím vyšší level dolu budeš mít tím vyšší počet zlata vytěžíš za hodinu.">
        // <i class="fas fa-info-circle"></i>
        // </button> VYŘEŠIT INFO BUTTON V castle.js NEFUNGUJE

        this.actualLevel = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        this.acTitle = createElement('h5');
        this.acTitle.innerHTML = 'Těžba při <b>aktuálním</b> stupni budovy'; //přidat data (Level x)

        this.acStatus = createElement('div', ['col']); //naplnit daty

        this.actualLevel.append(this.acTitle, this.acStatus);

        this.nextLevel = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        this.nlTitle = createElement('h5');
        this.nlTitle.innerHTML = 'Těžba při <b>dalším</b> stupni budovy'; //přidat data (Level x+1)

        this.nlStatus = createElement('div', ['col']); //naplnit daty

        this.nextLevel.append(this.nlTitle, this.nlStatus);

        this.container.append(this.h1Title, this.hr, this.actualLevel, this.nextLevel);

        this.app.append(this.container);
    }

    displayGoldMineData(data) {

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

        this.onDisplayGoldMineData(this.model.data);
    }

    onDisplayGoldMineData = (data) => {
        this.view.displayGoldMineData(data);
    }
}

export function buildGoldMine(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}