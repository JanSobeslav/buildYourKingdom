import { displayBuildTime, createElement, getElement } from "./glMethods.js";

class Model {
    constructor(data, unit) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
        this.unit = unit;
    }

    getBarracks() {
        const barracks = this.data.filter(b => {if (b.link === 'barracks') return b;});
        return barracks[0];
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.dialog = createElement('dialog');
        this.dialog.id = 'dialog-modal';

        this.modal = createElement('div', ["modal-dialog"]);
        this.modalCont = createElement('div', ["modal-content"]);

        this.modalHeader = createElement('div', ["modal-header"]);
        this.modalHeaderTitle = createElement('h5', ["modal-title"]);
        this.modalHeaderClose = createElement('button', ["btn-close"]);
        this.modalHeaderClose.setAttribute("type", "button");
        this.modalHeaderClose.setAttribute("aria-label", "Close");

        this.modalHeader.append(this.modalHeaderTitle, this.modalHeaderClose);

        this.modalContBody = createElement('div', ["modal-body"]);
        this.modalContBody.innerHTML = `
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">

                <button class="nav-link active" id="nav-recruit2-tab" data-bs-toggle="tab" data-bs-target="#nav-recruit2" type="button" role="tab" aria-controls="nav-recruit2" aria-selected="true">
                    Rekrutovat
                </button>

                <button class="nav-link" id="nav-discharge2-tab" data-bs-toggle="tab" data-bs-target="#nav-discharge2" type="button" role="tab" aria-controls="nav-discharge2" aria-selected="false">
                    Propustit ze služby
                </button>

            </div>
        </nav>
        `;

        this.bodyTabContent = createElement('div', ["tab-content"]);
        this.bodyTabContent.id = "nav-tabContent";

        this.bodyTabContentCont = createElement('div', ["tab-pane", "fade", "show", "active"]);
        this.bodyTabContentCont.id = "nav-recruit2";
        this.bodyTabContentCont.setAttribute("role", "tabpanel");
        this.bodyTabContentCont.setAttribute("aria-labelledby", "nav-recruit2-tab");

        this.bTcContainer = createElement('div', ["container"]);
         //dynamicky vložit údaje

        this.bodyTabContentCont.append(this.bTcContainer);

        this.bodyTabContentCont2 = createElement('div', ["tab-pane", "fade"]);
        this.bodyTabContentCont2.id = "nav-discharge2";
        this.bodyTabContentCont2.setAttribute("role", "tabpanel");
        this.bodyTabContentCont2.setAttribute("aria-labelledby", "nav-discharge2-tab");

        this.bTc2Container = createElement('div', ["container"]);

        this.bodyTabContentCont2.append(this.bTc2Container);

        this.bodyTabContent.append(this.bodyTabContentCont, this.bodyTabContentCont2);

        this.modalContBody.append(this.bodyTabContent);

        this.modalCont.append(this.modalHeader, this.modalContBody);
        
        this.modal.append(this.modalCont);

        this.dialog.append(this.modal);

        this.app.append(this.dialog);

        this.dialog.showModal();
    }

    displayData(data, building, settings) {
        this.modalHeaderTitle.innerHTML = data.name;
        let maxRecruitSol = (settings.gold - settings.gold % data.priceGold) / data.priceGold;
        let disTime = data.time * Math.pow(building.level > 0 ? building.level : building.level + 1, 3);
        this.bTcContainer.innerHTML = `
        <div class="row justify-content-around mt-4">
            <div class="col-3">
                <b>Počet</b>
            </div>
            <div class="col-3">
                <b>Náklady</b>
            </div>
            <div class="col-3">
                <b>Čas</b>
            </div>
            <div class="col-3">
                
            </div>
        </div>
        <div class="row justify-content-around mt-2 mb-2">
            <div class="col-3">
                <input type="number" id="input-${data.link}" class="form-control" id="basic-url" aria-describedby="basic-addon3" min="1" placeholder="${
                    maxRecruitSol
                }">
            </div>
            <div class="col-3" id="price-${data.link}">
                ${data.priceGold} <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> /
                ${Math.ceil(data.priceGold / 10)} <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i>
            </div>
            <div class="col-3" id="buildTime-${data.link}">
                ${ displayBuildTime(disTime) }
            </div>
            <div class="col-3">
                <button class="btn btn-primary" id="okBtn-${data.link}">OK</button>
            </div>
        </div>
        `;
        this.bodyTabContentCont.append(this.bTcContainer);

        this.bTc2Container.innerHTML = `
        <div class="row justify-content-around mt-4">
            <div class="col-3">
                <b>Počet</b>
            </div>
            <div class="col-3">
                <b>Vrácení</b>
            </div>
            <div class="col-3">

            </div>
        </div>
        <div class="row justify-content-around mt-2 mb-2">
            <div class="col-3">
                <input type="number" class="form-control" id="basic-url" aria-describedby="basic-addon3" min="1">
            </div>
            <div class="col-3">
                3 <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i>
            </div>
            <div class="col-3">
                <button class="btn btn-primary">OK</button>
            </div>
        </div>
        `;
        this.bodyTabContentCont2.append(this.bTc2Container);

        this.modalHeaderClose.addEventListener('click', () => { this.dialog.close(); });

        let input = document.getElementById("input-" + data.link);
        let okBtn = document.getElementById("okBtn-" + data.link);
        let buildTime = document.getElementById("buildTime-" + data.link);
        let priceEl = document.getElementById("price-" + data.link);

        input.addEventListener('keyup', () => {
            this.changeInput(input, maxRecruitSol, okBtn, buildTime, disTime, priceEl, {gold: data.priceGold, coins: data.priceCoins});
        });
        input.addEventListener('change', () => {
            this.changeInput(input, maxRecruitSol, okBtn, buildTime, disTime, priceEl, {gold: data.priceGold, coins: data.priceCoins});
        });
    }

    changeInput(input, max, okBtn, timeEl, time, priceEl, price) {
        timeEl.innerHTML = displayBuildTime((time * parseInt(input.value)));
        const priceGold = price.gold * input.value;
        priceEl.innerHTML = `
        ${priceGold} <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> /
                ${Math.ceil(priceGold / 10)} <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i>
        `;
        if (input.value > max) {
            input.style.color = 'red';
            timeEl.style.color = 'red';
            priceEl.style.color = 'red';
            okBtn.disabled = true;
        } else {
            input.style.color = 'black';
            timeEl.style.color = 'black';
            priceEl.style.color = 'black';
            okBtn.disabled = false;
        }
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.onDisplayData(this.model.unit, this.model.getBarracks(), this.model.settings);
    }

    onDisplayData = (data, building, settings) => {
        this.view.displayData(data, building, settings);
    };

}

export function buildDialog(elName, data, unit) {
    const app = new Controller(new Model(data, unit), new View(elName));
}