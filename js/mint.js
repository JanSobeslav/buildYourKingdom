import { displayBuildTime, createElement, getElement, save } from "./glFunctions.js";
import { buildNavigation as nav } from "./navigation.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;

        this._unchangedData = data.data;
    }

    submit(submitData) {
        const mintIndex = this.data.findIndex(b => b.link === 'mint');
        let date = new Date();
        date.setSeconds(date.getSeconds() + submitData.totalTime);

        this.settings.gold -= submitData.totalPrice;
        this.data[mintIndex].finishDateTime = date;

        save({ data: this.data, settings: this.settings });
    }

    changeActiveMintState(state) {
        this.settings.activeMintState = state;
        save({ data: this.data, settings: this.settings });
    }

    addToCoins(coins) {
        this.settings.coins += coins;
        save({ data: this.data, settings: this.settings });
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.container = createElement('div', ['container-fluid', 'px-4']);

        this.h1Title = createElement('h1', ['mt-4', 'mb-4']);
        this.infoButton = createElement('button');
        this.infoButton.setAttribute('style', 'background-color: transparent; border: solid transparent; cursor: help;');
        this.infoButton.setAttribute('title', ('V mincovně máš možnost razit zlaté mince, které poslouží jako hodnotné platidlo. Buď ovšem rozvážný! Ne vždy se vyplatí jimi platit a obchodníci tě rádi oberou, někdy však moc dobře nepočítají.'));
        this.infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';

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

        this.contentRowNewLevel = createElement('div', ['row', 'justify-content-start', 'mb-4']);

        this.container.append(this.h1Title, this.infoButton, this.hr, this.contentHead, this.contentRow, this.hr, this.contentRowNewLevel);

        this.app.append(this.container);
    }

    bindDisplayCoins(data, settings, submitHandler, activeMintStateHandler, addToCoins) {
        let [mint] = data.filter(data => data.link === 'mint');
        this.h1Title.innerHTML = mint.name;

        this.contentRow.innerHTML = `
        <div class="col-4">
            <input type="range" class="form-range" id="coinsRangeInput" min="1" max="5" value="1"> 
        </div>
        <div class="col-2" id="coins">
            1
        </div>
        <div class="col-2" id="coinTime">
            ${displayBuildTime((mint.coin.time - (Math.pow(mint.level, 3)))/settings.speedUp)}
        </div>
        <div class="col-2" id="coinPrice">
            ${mint.coin.price}
        </div>
        <div class="col-2">
            <button class="btn btn-primary" id="okBtnMint">Vyrazit</button>
        </div>
        `;

        this.contentRowNewLevel.innerHTML = `
            <h5>Ražba zlatých mincí při příštím stupni budovy (Level ${mint.level + 1})</h5>
            <div class="col">
                Vyražené mince: <b>1</b> <i class="fas fa-circle"
                    style="color: rgb(139, 126, 0);"></i> za <b style="color: darkgreen;">
                    ${displayBuildTime((mint.coin.time - (Math.pow(mint.level + 1, 3)))/settings.speedUp)}</b>
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
        let time = (mint.coin.time - (mint.level * 0.5)) * input_value;
        input.addEventListener('change', (event) => {
            input_value = parseInt(event.target.value);
            getElement('#coinTime').innerHTML = displayBuildTime(((mint.coin.time - (mint.level * 0.5)) * input_value)/settings.speedUp);
            getElement('#coinPrice').innerHTML = (mint.coin.price) * input_value;
            getElement('#coins').innerHTML = input_value;
            if (input_value * mint.coin.price > settings.gold) {
                okBtn.disabled = true;
                getElement('#coinPrice').style.color = 'red';
            } else {
                okBtn.disabled = false;
                getElement('#coinPrice').style.color = 'black';
            }

        });
        const dataSubmit = {
            totalPrice: input_value * mint.coin.price,
            totalCoins: input_value,
            totalTime: Math.round(time/settings.time)
        };
        okBtn.addEventListener('click', () => {
            if (input_value * mint.coin.price <= settings.gold) {
                okBtn.disabled = true;
                submitHandler(dataSubmit);
                activeMintStateHandler(true);
                upgrading();
                
                getElement('#game-navigation').innerHTML = '';
                nav('#game-navigation', { data: data, settings: settings });
            }
        });

        if (settings.activeMintState) {
            upgrading();
        }

        function upgrading() {
            const countdown = setInterval(() => {
                let bTime = displayBuildTime(dataSubmit.totalTime, mint.finishDateTime);
                let timeElement = getElement('#coinTime');
                if (timeElement) timeElement.innerHTML = `<strong style="color: darkgreen;">${bTime}</strong>`;

                if (bTime == "Dokončeno") {
                    activeMintStateHandler(false);
                    addToCoins(dataSubmit.totalCoins);
                    clearInterval(countdown);
                    if (settings.activeLink === 'mint') {
                        getElement('#content').innerHTML = '';
                        buildMint('#content', { data: data, settings: settings });
                        getElement('#game-navigation').innerHTML = '';
                        nav('#game-navigation', { data: data, settings: settings });
                    }
                }
            }, 100);
        }
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.handleDisplayCoins(this.model.data, this.model.settings, this.handleSubmit, this.handleActiveMintState, this.handleAddToCoins);
    }

    handleDisplayCoins = (data, settings, submitHandler, mintStateHandler, addToCoins) => {
        this.view.bindDisplayCoins(data, settings, submitHandler, mintStateHandler, addToCoins);
    }

    handleSubmit = (data) => {
        this.model.submit(data);
    }

    handleActiveMintState = (state) => {
        this.model.changeActiveMintState(state);
    }

    handleAddToCoins = (coins) => {
        this.model.addToCoins(coins);
    }

}

export function buildMint(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}