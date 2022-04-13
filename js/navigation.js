import { getElement, createElement, serverTime, save } from "./glMethods.js";
import { buildCastle as castle } from "./castle.js";
import { buildGoldMine as mine } from "./gold-mine.js";
import { buildBarracks as barracks } from "./barracks.js";
import { buildMint as mint } from "./mint.js";

class Model {
    constructor(data) {
        this.data = data.data;
        this.settings = data.settings;
    }

    bindDelivery(gold) {
        this.settings.gold += gold;
        save({ data: this.data, settings: this.settings });
    }

    bindTitleChange(title) {
        this.settings.townName = title;
        save({ data: this.data, settings: this.settings });
    }

    bindSpeedUp(speed) {
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
        this.toggleButton.id = 'sidebarToggle';
        this.toggleButton.innerHTML = '<i class="fas fa-bars"></i>';

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


    displayUserName(settings) {
        this.userName.textContent = settings.userName;
    }

    displayTownName(settings, handleTitleChange) {
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

    displayResources(settings, data, deliveryHandler) {
        let nextDelivery = new Date();
        const index = data.findIndex((b) => b.link === 'gold-mine');
        this.displayRes(nextDelivery, settings);
        setTimeout(() => { this.isDelivered = false; }, 1000);
        const interval = setInterval(() => {
            nextDelivery = new Date();
            if ((nextDelivery.getMinutes() == 0) && nextDelivery.getSeconds() == 0 && !this.isDelivered) {
                this.isDelivered = true;
                deliveryHandler(1 * (Math.pow(data[index].level, 2)));
                clearInterval(interval);
                this.displayResources(settings, data, deliveryHandler);
            }
        }, 500);

    }

    displayRes(nextDelivery, settings) {
        nextDelivery = nextDelivery.getHours() + 1;
        this.resources.innerHTML = `
        <i class="fas fa-cube" style="color: rgb(139, 126, 0);"></i> <span class="text-secondary" style="margin-left: 0.2rem;margin-right: 0.5rem;">${settings.gold} </span> 
        <i class="fas fa-circle" style="color: rgb(139, 126, 0);"></i> <span class="text-secondary" style="margin-left: 0.2rem;margin-right: 0.5rem;">${settings.coins}</span>
        <i class="fas fa-trailer" style="color: #522900;margin-left: 1.5rem;margin-right: 0.5rem;"></i>
        <span class="text-secondary">Další dodávka: <span id="next-delivery"> ${nextDelivery}:00:00 </span></span>`;
    }

    displayArmy(data, settings) {
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

    }

    displaySpeed(data, settings, handleSpeedUp) {
        this.speed(null, settings, handleSpeedUp);
        this.speedUp.addEventListener('click', () => {
            const speed = settings.speedUp + 1;
            handleSpeedUp(speed);
            this.speed(speed, settings, handleSpeedUp);
            const dataAll = {data, settings};
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

        this.onGameInfoDisplay(this.model.settings, this.model.data, this.onDelivery, this.onTitleChange, this.onSpeedUp);
    }

    onGameInfoDisplay = (settings, data, deliveryHandler, handleTitleChange, handleSpeedUp) => {
        this.view.displayUserName(settings);
        this.view.displayTownName(settings, handleTitleChange);
        this.view.displayResources(settings, data, deliveryHandler);
        this.view.displayArmy(data, settings);
        this.view.displaySpeed(data, settings, handleSpeedUp);
    }

    onDelivery = (gold) => {
        this.model.bindDelivery(gold);
    }

    onTitleChange = (newTitle) => {
        this.model.bindTitleChange(newTitle);
    }

    onSpeedUp = (speed) => {
        this.model.bindSpeedUp(speed);
    }
}

export function buildNavigation(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}
