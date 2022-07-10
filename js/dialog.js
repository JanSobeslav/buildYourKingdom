import { displayBuildTime, createElement, getElement, save } from "./glFunctions.js";
import { buildNavigation as nav } from "./navigation.js";
import { buildBarracks as barracks, buildBarracks } from "./barracks.js";
import { getData } from "./data.js";

class Model {
    constructor(data, unit) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
        this.unit = unit;
    }

    getBarracks() {
        const [barracks] = this.data.filter(b => { if (b.link === 'barracks') return b; });
        return barracks;
    }

    getArmySum() {
        switch (this.unit.link) {
            case 'swordsman':
                return this.settings.army.swordsmans;
            case 'archer':
                return this.settings.army.archers;
            case 'horseman':
                return this.settings.army.horsemans;
        }
    }

    submit(data) {
        if (data.totalTime) {
            const buildingIndex = this.data.findIndex(b => b.link === 'barracks');
            const unitIndex = this.data[buildingIndex].soldiers_type.findIndex(u => u.link == data.unitType);
            const finishDate = new Date();
            finishDate.setSeconds(finishDate.getSeconds() + data.totalTime);
            this.settings.gold -= data.totalPrice;
            this.data[buildingIndex].soldiers_type[unitIndex].finishDateTime = finishDate;
            this.data[buildingIndex].soldiers_type[unitIndex].inProccess = data.unitSum;
            this.settings.activeRecruitState = true;
        } else {
            switch (data.unitType) {
                case 'swordsman':
                    this.settings.army.swordsmans -= data.unitSum;
                    break;
                case 'archer':
                    this.settings.army.archers -= data.unitSum;
                    break;
                case 'horseman':
                    this.settings.army.horsemans -= data.unitSum;
                    break;
            }
            this.settings.gold += data.totalPrice;
        }

        save({ data: this.data, settings: this.settings });
    }

    changeRecruitState(state, building) {
        this.settings.activeRecruitState = state;
        this.settings.recruitingUpgradingState = building;
        save({ data: this.data, settings: this.settings });
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

        this.isRecruitTabActive = true;
    }

    bindDisplayData(data, building, settings, submitHandler, activeRecruitStateHandler, armySum) {
        this.modalHeaderTitle.innerHTML = data.name;
        let maxRecruitSol = (settings.gold - settings.gold % data.priceGold) / data.priceGold;
        let disTime = data.time - Math.pow(building.level, 2);
        let recruitTab = getElement('#nav-recruit2-tab');
        let dischargeTab = getElement('#nav-discharge2-tab');
        recruitTab.addEventListener('click', () => {
            if (!this.isRecruitTabActive) {
                this.isRecruitTabActive = true;
                recruitTab.classList.add('active');
                dischargeTab.classList.remove('active');
                this.bodyTabContentCont.classList.add('show');
                this.bodyTabContentCont.classList.add('active');
                this.bodyTabContentCont2.classList.remove('show');
                this.bodyTabContentCont2.classList.remove('active');
                this.bindDisplayData(data, building, settings, submitHandler, activeRecruitStateHandler, armySum);
            }

        });
        dischargeTab.addEventListener('click', () => {
            if (this.isRecruitTabActive) {
                this.isRecruitTabActive = false;
                dischargeTab.classList.add('active');
                recruitTab.classList.remove('active');
                this.bodyTabContentCont2.classList.add('show');
                this.bodyTabContentCont2.classList.add('active');
                this.bodyTabContentCont.classList.remove('show');
                this.bodyTabContentCont.classList.remove('active');
                this.bindDisplayData(data, building, settings, submitHandler, activeRecruitStateHandler, armySum);
            }
        });
        if (this.isRecruitTabActive) {
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
                <input type="number" id="input-${data.link}" value="1" class="form-control" id="basic-url" aria-describedby="basic-addon3" min="1" placeholder="${maxRecruitSol
                }">
            </div>
            <div class="col-3" id="price-${data.link}">
                ${data.priceGold} <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> /
                ${Math.ceil(data.priceGold / 10)} <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i>
            </div>
            <div class="col-3" id="buildTime-${data.link}">
                ${displayBuildTime(disTime)}
            </div>
            <div class="col-3">
                <button class="btn btn-primary" id="okBtn-${data.link}">OK</button>
            </div>
        </div>
        `;
            this.bodyTabContentCont.append(this.bTcContainer);
        } else {
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
                <input type="number" class="form-control" id="input-${data.link}Dis" aria-describedby="basic-addon3" min="1" value="1">
            </div>
            <div class="col-3" id="change-${data.link}">
                3 <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i>
            </div>
            <div class="col-3">
            <button class="btn btn-primary" id="okBtn-${data.link}Dis">OK</button>
            </div>
        </div>
        `;
            this.bodyTabContentCont2.append(this.bTc2Container);
        }




        this.modalHeaderClose.addEventListener('click', () => { this.dialog.close(); });

        let input = getElement("#input-" + data.link + (this.isRecruitTabActive ? '' : 'Dis'));
        let okBtn = getElement("#okBtn-" + data.link + (this.isRecruitTabActive ? '' : 'Dis'));
        let buildTime = getElement("#buildTime-" + data.link);
        let priceEl = getElement("#price-" + data.link);
        let changeEl = getElement("#change-" + data.link);

        input.addEventListener('keyup', () => {
            this.changeInput(input, maxRecruitSol, okBtn, buildTime, disTime, priceEl, { gold: data.priceGold, coins: data.priceCoins }, armySum, changeEl);
        });
        input.addEventListener('change', () => {
            this.changeInput(input, maxRecruitSol, okBtn, buildTime, disTime, priceEl, { gold: data.priceGold, coins: data.priceCoins }, armySum, changeEl);
        });
        input.dispatchEvent(new Event("change"));

        okBtn.addEventListener('click', () => {
            if (this.isRecruitTabActive) {
                if (input.value <= maxRecruitSol) {
                    const dataSubmit = {
                        unitSum: +input.value,
                        totalPrice: data.priceGold * +input.value,
                        unitType: data.link,
                        totalTime: disTime * +input.value
                    };
                    submitHandler(dataSubmit);
                    activeRecruitStateHandler(true, data.link);
                    getElement('#content').innerHTML = '';
                    buildBarracks('#content', getData());
                    this.dialog.close();
                    getElement('#game-navigation').innerHTML = '';
                    nav('#game-navigation', getData());
                }
            } else {
                if (input.value < armySum) {
                    const dataSubmit = {
                        unitSum: +input.value,
                        totalPrice: Math.round(data.priceGold / 2) * +input.value,
                        unitType: data.link,
                        totalTime: null
                    };
                    submitHandler(dataSubmit);
                    getElement('#barracks-cont').remove();
                    buildBarracks('#content', getData());
                    getElement('#game-navigation').innerHTML = '';
                    nav('#game-navigation', getData());
                }
            }

        });
    }

    changeInput(input, max, okBtn, timeEl, time, priceEl, price, armySum, changeEl) {
        const priceGold = price.gold * input.value;
        if (this.isRecruitTabActive) {
            timeEl.innerHTML = displayBuildTime((time * parseInt(input.value)));
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
        } else {
            changeEl.innerHTML = `
             ${Math.round(price.gold / 2) * input.value} <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i>
            `;
            if (input.value > armySum) {
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
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.handleDisplayData(this.model.unit, this.model.getBarracks(), this.model.settings, this.handleSubmit, this.handleRecruitState, this.model.getArmySum());
    }

    handleDisplayData = (data, building, settings, submitHandler, recruitStateHandler, armySum) => {
        this.view.bindDisplayData(data, building, settings, submitHandler, recruitStateHandler, armySum);
    }

    handleSubmit = (data) => {
        this.model.submit(data);
    }

    handleRecruitState = (state, building) => {
        this.model.changeRecruitState(state, building);
    }

}

export function buildDialog(elName, data, unit) {
    const app = new Controller(new Model(data, unit), new View(elName));
}