import { getElement, createElement, serverTime, save, timeDiffCalc } from "./glFunctions.js";
import { buildCastle as castle } from "./castle.js";
import { buildGoldMine as mine } from "./gold-mine.js";
import { buildBarracks as barracks } from "./barracks.js";
import { buildMint as mint } from "./mint.js";
import { buildDialogNewUser } from "./dialog-user.js";
import { buildEventAttack } from "./eventAttack.js";

class Model {
    constructor(data) {
        this.data = data.data;
        this.settings = data.settings;
    }

    delivery(gold, hours) {
        this.settings.gold += gold;
        if (hours === 0) {
            this.settings.hoursFromStart++;
        } else {
            this.settings.hoursFromStart += hours;
        }
        save({ data: this.data, settings: this.settings });
    }

    changeTitle(title) {
        this.settings.townName = title;
        save({ data: this.data, settings: this.settings });
    }

    speedUp(speed) {
        this.settings.speedUp = speed;
        save({ data: this.data, settings: this.settings });
    }

}

class View {
    constructor(elName) {
        this.app = getElement(elName);
        //nav
        this.nav = createElement('nav', ['sb-topnav', 'navbar', 'navbar-expand', 'navbar-dark', 'bg-dark']);
        this.nav.id = "game-navigation";
        //title
        this.title = createElement('a', ['navbar-brand', 'ps-3']);
        this.titleInput = createElement('input', ['ms-2']);
        this.titleInput.hidden = true;
        this.titleInputOk = createElement('button', ['ms-1', 'btn', 'btn-primary']);
        this.titleInputOk.innerHTML = 'Ok';
        this.titleInputOk.hidden = true;
        //toggleButton
        this.toggleButton = createElement('button', ['btn', 'btn-link', 'btn-sm', 'order-1', 'order-lg-0', 'me-4', 'me-lg-0', 'mr-5']);
        this.toggleButton.innerHTML = '<i class="fas fa-bars text-secondary"></i>';

        //army
        this.army = createElement('span', ['ms-auto']);

        //resources
        this.resources = createElement('span', ['ms-auto']);

        //speedUp

        this.speedUp = createElement('div', ['ms-auto']);
        this.speedUp.style.cursor = 'pointer';
        this.speedUp.innerHTML = `<i class="fas fa-play text-secondary"></i>`;

        //userMenu
        this.userMenuUL = createElement('ul', ['navbar-nav', 'ms-auto', 'me-0', 'me-md-3', 'my-2', 'my-md-0', 'd-none', 'd-md-inline-block', 'form-inline']);
        this.userMenuLI = createElement('li', ['nav-item', 'dropdown']);

        this.toggleDropdown = createElement('a', ['nav-link']);
        this.toggleDropdown.innerHTML = '<i class="fas fa-user fa-fw"></i>';

        this.userName = createElement('span', 'userNameMenu');

        this.toggleDropdown.append(this.userName);

        this.userMenuLI.append(this.toggleDropdown);
        this.userMenuUL.append(this.userMenuLI);

        this.nav.append(this.title, this.titleInput, this.titleInputOk, this.toggleButton, this.army, this.resources, this.speedUp, this.userMenuUL);
        this.app.append(this.nav);

        this.isDelivered = false;
    }


    bindDisplayUserName(data, settings) {
        this.userName.textContent = settings.userName;
        if (!settings.userName) {
            buildDialogNewUser('#root', {data, settings});
        }
    }

    bindDisplayTownName(settings, handleTitleChange) {
        this.title.innerHTML = settings.townName + '<i class="fas fa-edit ms-2 text-white"></i>';

        this.title.addEventListener('click', () => {
            this.title.hidden = true;
            this.titleInput.hidden = false;
            this.titleInput.type = 'text';
            this.titleInput.value = settings.townName;
            this.titleInputOk.hidden = false;
        });

        this.titleInputOk.addEventListener('click', () => {
            handleTitleChange(this.titleInput.value);
            this.title.innerHTML = settings.townName + '<i class="fas fa-edit ms-2 text-white"></i>';
            this.title.hidden = false;
            this.titleInput.hidden = true;
            this.titleInputOk.hidden = true;
        });
    }

    bindDisplayResources(settings, data, deliveryHandler) {
        const startDate = new Date(settings.startGameDate);
        const today = new Date();
        const index = data.findIndex((b) => b.link === 'gold-mine');
        this.displayRes(today, settings, startDate);
        setTimeout(() => { this.isDelivered = false; }, 1000);
        const interval = setInterval(() => {
            const now = new Date();
            if ((now.getMinutes() == startDate.getMinutes()) && now.getSeconds() == startDate.getSeconds() && !this.isDelivered) {
                this.isDelivered = true;
                deliveryHandler(Math.pow(data[index].level, 2));
                clearInterval(interval);
                this.bindDisplayResources(settings, data, deliveryHandler);
            }
        }, 1000);
        if (settings.startGameDate) {
            let today = new Date();
            let startDate1 = new Date(settings.startGameDate);
            startDate1.setHours(startDate1.getHours() + settings.hoursFromStart);
            let _startDate1 = new Date(startDate1);
            let _today = new Date(today);

            _startDate1.setUTCHours(0, 0, 0, 0);
            _today.setUTCHours(0, 0, 0, 0);
            const actualDiffHours = Math.floor((today - startDate1) / 3600000);
            if (_startDate1 !== _today && actualDiffHours > 0) {
                deliveryHandler((Math.pow(data[index].level, 2)) * actualDiffHours, actualDiffHours);
                getElement('#game-navigation').innerHTML = '';
                buildNavigation('#game-navigation', {data, settings});
            }
        }
    }

    displayRes(nextDelivery, settings, startDate) {
        const minutes = startDate.getMinutes();
        let hours = nextDelivery.getHours();
        if (nextDelivery.getMinutes() > minutes) hours++;
        this.resources.innerHTML = `
        <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> <span class="text-secondary" style="margin-left: 0.2rem;margin-right: 0.5rem;">${settings.gold} </span> 
        <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i> <span class="text-secondary" style="margin-left: 0.2rem;margin-right: 0.5rem;">${settings.coins}</span>
        <i class="fas fa-trailer" 
        title="Občas se může stát, že se o chvíli zpozdí nebo pracovníkům chvíli trvá než náklad složí. Buď trpělivý a počkej chvilku." 
        style="color: #522900;margin-left: 1.5rem;margin-right: 0.5rem; cursor: help;"></i>
        <span class="text-secondary">Další dodávka: <span id="next-delivery"> ${hours}:${minutes < 10 ? '0' + minutes : minutes} </span></span>`;
    }

    bindDisplayArmy(data, settings) {
        const [barracks] = data.filter(b => b.link === 'barracks');
        let [swordsmanIcon] = barracks.soldiers_type.filter(u => u.link === 'swordsman');
        swordsmanIcon = swordsmanIcon.icon;
        let [archerIcon] = barracks.soldiers_type.filter(u => { if (u.link === 'archer') return u.icon });
        archerIcon = archerIcon.icon;
        let [horsemanIcon] = barracks.soldiers_type.filter(u => { if (u.link === 'horseman') return u.icon });
        horsemanIcon = horsemanIcon.icon;
        this.army.innerHTML = `
                <i class="${swordsmanIcon}" style="color: white;"></i><span class="text-secondary" style="margin-left: 0.4rem;margin-right: 0.8rem;">${settings.army.swordsmans} </span>
                <i class="${archerIcon}" style="color: white;"></i><span class="text-secondary" style="margin-left: 0.4rem;margin-right: 0.8rem;">${settings.army.archers} </span>
                <i class="${horsemanIcon}" style="color: white;"></i><span class="text-secondary" style="margin-left: 0.4rem;margin-right: 0.8rem;">${settings.army.horsemans} </span>
            `;

        if (!settings.event_attack.attackState) {
            const time = Math.floor(Math.random() * 15) + 1;
            //setTimeout(() => {
               buildEventAttack('#root', {data, settings}); 
            //}, time * 10000);
        }
    }

    bindDisplaySpeed(data, settings, handleSpeedUp) {
        this.speed(null, settings, handleSpeedUp);
        this.speedUp.addEventListener('click', () => {
            const speed = settings.speedUp + 1;
            handleSpeedUp(speed);
            this.speed(speed, settings, handleSpeedUp);
            const dataAll = { data, settings };
            getElement('#content').innerHTML = '';
            switch (settings.activeLink) {
                case 'castle':
                    castle(('#content'), dataAll);
                    break;
                case 'gold-mine':
                    mine(('#content'), dataAll);
                    break;
                case 'barracks':
                    barracks(('#content'), dataAll);
                    break;
                case 'mint':
                    mint(('#content'), dataAll);
                    break;
            }
        });
    }

    speed(s = null, settings, handleSpeedUp) {
        if (s === null) s = settings.speedUp;
        switch (s) {
            case 1:
                this.speedUp.innerHTML = `<i class="fas fa-play text-secondary"></i>`;
                break;
            case 2:
                this.speedUp.innerHTML = `<i class="fas fa-forward text-secondary"></i>`;
                break;
            case 3:
                this.speedUp.innerHTML = `<i class="fas fa-fast-forward text-secondary"></i>`;
                break;
            default:
                handleSpeedUp(1);
                this.speedUp.innerHTML = `<i class="fas fa-play text-secondary"></i>`;
                break;
        }
    }

}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.onGameInfoDisplay(this.model.settings, this.model.data, this.handleDelivery, this.handleTitleChange, this.handleSpeedUp);
    }

    onGameInfoDisplay = (settings, data, deliveryHandler, handleTitleChange, handleSpeedUp) => {
        this.view.bindDisplayUserName(data, settings);
        this.view.bindDisplayTownName(settings, handleTitleChange);
        this.view.bindDisplayResources(settings, data, deliveryHandler);
        this.view.bindDisplayArmy(data, settings);
        this.view.bindDisplaySpeed(data, settings, handleSpeedUp);
    }

    handleDelivery = (gold, hour = 0) => {
        this.model.delivery(gold, hour);
    }

    handleTitleChange = (newTitle) => {
        this.model.changeTitle(newTitle);
    }

    handleSpeedUp = (speed) => {
        this.model.speedUp(speed);
    }
}

export function buildNavigation(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}
