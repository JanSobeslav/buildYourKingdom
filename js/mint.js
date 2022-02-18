import { createElement, getElement } from "./elements.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;

        this._unchangedData = data.data;
    }

}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.container = createElement('div', ['container-fluid', 'px-4']);

        this.h1Title = createElement('h1', ['mt-4', 'mb-4']);
        this.hr = createElement('hr');

        this.contentHead = createElement('div', ['row', 'justify-content-start', 'mb-4']);
        this.contentHead.innerHTML = `
            <div class="col-4">
            </div>
            <div class="col-2">
                <b>Počet mincí</b>
            </div>
            <div class="col-2">
                <b>Čas</b>
            </div>
            <div class="col-2">
                <b>Potřebné zlato</b>
            </div>
            <div class="col-2">
                <b>Vyrazit</b>
            </div>
        `;

        this.contentRow = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        //display content

        this.contentRowNewLevel = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        //display content

        this.container.append(this.h1Title, this.hr, this.contentHead, this.contentRow, this.hr, this.contentRowNewLevel);

        this.app.append(this.container);

    }

    displayCoins(data) {
        let i = data.findIndex(data => data.link === 'mint');
        this.h1Title.innerHTML = data[i].name;

        this.contentRow.innerHTML = `
        <div class="col-4">
            <input type="range" class="form-range" id="coinsRangeInput" min="1" max="5" value="1"> 
        </div>
        <div class="col-2" id="coins">
            1
        </div>
        <div class="col-2" id="coinTime">
            ${this.displayBuildTime(data[i].coin.time - (Math.pow(data[i].level, 3)))}
        </div>
        <div class="col-2" id="coinPrice">
            ${data[i].coin.price}
        </div>
        <div class="col-2">
            <button class="btn btn-primary">OK</button>
        </div>
        `;

        this.contentRowNewLevel.innerHTML = `
            <h5>Ražba zlatých mincí při příštím stupni budovy (Level ${data[i].level + 1})</h5>
            <div class="col">
                Vyražené mince: <b>1</b> <i class="fas fa-circle"
                    style="color: rgb(139, 126, 0);"></i> za <b style="color: darkgreen;">
                    ${this.displayBuildTime(data[i].coin.time - (Math.pow(data[i].level + 1, 3)))}</b>
            </div>
        `;

        let input = getElement('#coinsRangeInput');
        input.addEventListener('change', (event) => {
            let input_value = event.target.value;
            getElement('#coinTime').innerHTML = this.displayBuildTime((data[i].coin.time - (data[i].level * 0.5)) * input_value);
            getElement('#coinPrice').innerHTML = (data[i].coin.price) * input_value;
            getElement('#coins').innerHTML = input_value;
            // this.coinPriceChange(data, uData, parseInt(input_value));
          });
    }

    coinPriceChange(data, uData, count) {
        let i = uData.findIndex(data => data.link === 'mint');
        data[i].coin.price = uData[i].coin.price * count;
        data[i].coin.time = uData[i].coin.time * count;
        this.displayCoins(data, uData, count);
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

        this.onDisplayCoins(this.model.data, this.model._unchangedData, 1);
    }

    onDisplayCoins = (data, count) => {
        this.view.displayCoins(data, count);
    }

}

export function buildMint(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}