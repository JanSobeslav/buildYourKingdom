import { displayBuildTime, createElement, getElement } from "./glMethods.js";
import { buildNavigation as nav } from "./navigation.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;

        this._unchangedData = data.data;
    }

    bindSubmit(submitData) {
        const mintIndex = this.data.findIndex(b => b.link === 'mint');
        let date = new Date();
        date.setSeconds(date.getSeconds() + submitData.totalTime);

        this.settings.gold -= submitData.totalPrice;
        this.data[mintIndex].finishDateTime = date;
        setTimeout(() => {
            this.settings.coins += submitData.totalCoins;
            getElement('#game-navigation').innerHTML = '';
            nav('#game-navigation', this.allData);
        }, submitData.totalTime * 1000);

    }

    bindActiveMintState(state) {
        this.settings.activeMintState = state;
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
            </div>
        `;

        this.contentRow = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        //display content

        this.contentRowNewLevel = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        //display content

        this.container.append(this.h1Title, this.hr, this.contentHead, this.contentRow, this.hr, this.contentRowNewLevel);

        this.app.append(this.container);

    }

    displayCoins(data, settings, submitHandler, activeMintStateHandler) {
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
            ${displayBuildTime(data[i].coin.time - (Math.pow(data[i].level, 3)))}
        </div>
        <div class="col-2" id="coinPrice">
            ${data[i].coin.price}
        </div>
        <div class="col-2">
            <button class="btn btn-primary" id="okBtnMint">Vyrazit</button>
        </div>
        `;

        this.contentRowNewLevel.innerHTML = `
            <h5>Ražba zlatých mincí při příštím stupni budovy (Level ${data[i].level + 1})</h5>
            <div class="col">
                Vyražené mince: <b>1</b> <i class="fas fa-circle"
                    style="color: rgb(139, 126, 0);"></i> za <b style="color: darkgreen;">
                    ${displayBuildTime(data[i].coin.time - (Math.pow(data[i].level + 1, 3)))}</b>
            </div>
        `;

        let input = getElement('#coinsRangeInput');
        let okBtn = getElement('#okBtnMint');
        let input_value = 1;

        if (settings.activeMintState) {
            okBtn.disabled = true;
        } else {
            okBtn.disabled = false;
        }
        input.addEventListener('change', (event) => {
            input_value = parseInt(event.target.value);
            getElement('#coinTime').innerHTML = displayBuildTime((data[i].coin.time - (data[i].level * 0.5)) * input_value);
            getElement('#coinPrice').innerHTML = (data[i].coin.price) * input_value;
            getElement('#coins').innerHTML = input_value;
            // this.coinPriceChange(data, uData, parseInt(input_value));
            if (input_value * data[i].coin.price > settings.gold) {
                okBtn.disabled = true;
                getElement('#coinPrice').style.color = 'red';
            } else {
                okBtn.disabled = false;
                getElement('#coinPrice').style.color = 'black';
            }

        });
        okBtn.addEventListener('click', () => {
            if (input_value * data[i].coin.price <= settings.gold) {
                let time = (data[i].coin.time - (data[i].level * 0.5)) * input_value;
                okBtn.disabled = true;
                const dataSubmit = {
                    totalPrice: input_value * data[i].coin.price,
                    totalCoins: input_value,
                    totalTime: Math.round(time)
                };
                submitHandler(dataSubmit);
                activeMintStateHandler(true);

                const countdown = setInterval(() => {
                    let bTime = displayBuildTime(dataSubmit.totalTime, data[i].finishDateTime);
                    let timeElement = getElement('#coinTime');
                    if (timeElement) timeElement.innerHTML = `<strong style="color: darkgreen;">${bTime}</strong>`;

                    if (bTime == "Stavba dokončena") {
                        activeMintStateHandler(false);
                        clearInterval(countdown);
                        if (settings.activeLink === 'mint') {
                            this.app.innerHTML = '';
                            buildMint('#content', { data: data, settings: settings });
                            getElement('#game-navigation').innerHTML = '';
                            nav('#game-navigation', { data: data, settings: settings });
                        }
                    }
                }, 100);

                getElement('#game-navigation').innerHTML = '';
                nav('#game-navigation', { data: data, settings: settings });
            }
        });
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.onDisplayCoins(this.model.data, this.model.settings, this.onSubmit, this.onActiveMintState);
    }

    onDisplayCoins = (data, settings, submitHandler, mintStateHandler) => {
        this.view.displayCoins(data, settings, submitHandler, mintStateHandler);
    }

    onSubmit = (data) => {
        this.model.bindSubmit(data);
    }

    onActiveMintState = (state) => {
        this.model.bindActiveMintState(state);
    }

}

export function buildMint(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}