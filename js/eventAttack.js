import { createElement, getElement, displayBuildTime, fight } from "./glMethods.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    bindFinishTimeState(time) {
        if (time !== "") {
            let date = new Date();
            date.setSeconds(date.getSeconds() + time);
            this.settings.event_attack.arriveDate = date;
        } else {
            this.settings.event_attack.arriveDate = "";
        }
    }

    bindArmy(army) {
        this.settings.army = army;
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

    displayEvent(data, settings, time, setArmy) {
        const [barracks] = data.filter(b => b.link === 'barracks');
        time((settings.event_attack.time * barracks.level));
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
                ${settings.event_attack.units.swordsmans + settings.event_attack.units.archers + settings.event_attack.units.horsemans}
            </div>
        </div>
        `;

        const countdown = setInterval(() => {
            let bTime = displayBuildTime(time, settings.event_attack.arriveDate);
            let timeElement = getElement('#time-event_attack');

            if (timeElement) timeElement.innerHTML = bTime;

            if (bTime == "Dokončeno") {
                //setArmy(fight(settings.army, settings.event_attack.units));
                settings.event_attack.attackState = false;
                this.alert.remove();
                clearInterval(countdown);
            }
        }, 100);
    }

}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.onDisplayEvent(this.model.data, this.model.settings, this.bindFinishTime, this.bindArmy);
    }

    onDisplayEvent = (data, settings, bindArriveTime) => {
        this.view.displayEvent(data, settings, bindArriveTime);
    }

    bindFinishTime = (time) => {
        this.model.bindFinishTimeState(time);
    }

    bindArmy = (army) => {
        this.model.bindArmy(army);
    }
}

export function buildEventAttack(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}