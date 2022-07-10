import { createElement, getElement, displayBuildTime, fight, save } from "./glFunctions.js";
import { buildNavigation as nav } from "./navigation.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;

        this.settings.event_attack.attackState = true;
    }

    changeFinishTimeState(time) {
        if (time !== "") {
            let date = new Date();
            date.setSeconds(date.getSeconds() + (time * this.settings.hoursFromStart));
            this.settings.event_attack.arriveDate = date;
        } else {
            this.settings.event_attack.arriveDate = "";
        }
        save({ data: this.data, settings: this.settings });
    }

    setArmy(army) {
        this.settings.army = army;
        this.settings.event_attack.attackState = false;
        save({ data: this.data, settings: this.settings });
    }

    decreaseGold(gold) {
        this.settings.gold -= gold;
        save({ data: this.data, settings: this.settings });
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.alert = createElement('div', ['alert', 'alert-danger', 'zindex-popover', 'w-25', 'position-absolute', 'end-0', 'bottom-0', 'm-5']);
        this.alert.id = "event-alert";
        this.alert.setAttribute("role", "alert");
        this.alert.innerHTML = `<i class="fas fa-skull-crossbones me-2 fs-2"></i><span class="fs-2 fw-bolder">Útok</span><hr>`;

        this.alertContent = createElement('div');

        this.alert.append(this.alertContent);

        this.app.append(this.alert);
    }

    bindDisplayEvent(data, settings, timeHandler, setArmy, decreaseGold) {
        const [barracks] = data.filter(b => b.link === 'barracks');
        timeHandler(settings.event_attack.time * (Math.floor(Math.random() * 6) + 1) + settings.hoursFromStart);
        const numOfUnits = settings.event_attack.units + (2 * settings.hoursFromStart);
        this.alertContent.innerHTML = `
        <div class="row">
            <div class="col-6">
            <b>Čas příchodu</b>
            </div>
            <div class="col-6" id="time-event_attack"></div>
        </div>
        <div class="row">
            <div class="col-6">
            <b>Počet jednotek</b>
            </div>
            <div class="col-6">
                ${numOfUnits}
            </div>
        </div>
        `;

        const countdown = setInterval(() => {
            let bTime = displayBuildTime(settings.event_attack.time, settings.event_attack.arriveDate);
            let timeElement = getElement('#time-event_attack');
            if (timeElement) timeElement.innerHTML = bTime;
            if (bTime == "Dokončeno" && settings.event_attack.attackState) {
                const fightResults = fight(settings.army, numOfUnits);
                setArmy(fightResults.userArmy);
                if (fightResults.enemyArmy > 0) decreaseGold(fightResults.enemyArmy);
                getElement('#game-navigation').innerHTML = '';
                nav('#game-navigation', { data: data, settings: settings });
                clearInterval(countdown);
                this.alert.remove();
            }
        }, 100);
    }

}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.handleDisplayEvent(this.model.data, this.model.settings, this.handleFinishTime, this.handleArmy, this.handleDecreaseGold);
    }

    handleDisplayEvent = (data, settings, bindArriveTime, bindArmy, decreaseGoldHandler) => {
        this.view.bindDisplayEvent(data, settings, bindArriveTime, bindArmy, decreaseGoldHandler);
    }

    handleFinishTime = (time) => {
        this.model.changeFinishTimeState(time);
    }

    handleArmy = (army) => {
        this.model.setArmy(army);
    }

    handleDecreaseGold = (gold) => {
        this.model.decreaseGold(gold);
    }
}

export function buildEventAttack(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}