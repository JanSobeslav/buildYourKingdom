import { getElement, createElement, serverTime } from "./glMethods.js";

class Model {
    constructor(data) {
        this.data = data.data;
        this.settings = data.settings;
    }

    bindDelivery(gold) {
        this.settings.gold += gold;
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
        this.title.textContent = 'Název města MVC';
        this.title.addEventListener('click', event => { location.reload(); });
        //toggleButton
        this.toggleButton = createElement('button', ['btn', 'btn-link', 'btn-sm', 'order-1', 'order-lg-0', 'me-4', 'me-lg-0', 'mr-5']);
        this.toggleButton.id = 'sidebarToggle';
        this.toggleButton.innerHTML = '<i class="fas fa-bars"></i>';

        //resources
        this.resources = createElement('span', ['ms-auto']);

        //userMenu
        this.userMenuUL = createElement('ul', ['navbar-nav', 'ms-auto', 'ms-auto', 'me-0', 'me-md-3', 'my-2', 'my-md-0', 'd-none', 'd-md-inline-block', 'form-inline']);
        this.userMenuLI = createElement('li', ['nav-item', 'dropdown']);

        this.toggleDropdown = createElement('a', ['nav-link', 'dropdown-toggle']);
        this.toggleDropdown.id = 'navbarDropdown';
        this.toggleDropdown.setAttribute('role', 'button');
        this.toggleDropdown.setAttribute('data-bs-toggle', 'dropdown');
        this.toggleDropdown.innerHTML = '<i class="fas fa-user fa-fw"></i>';

        this.userName = createElement('span', 'userNameMenu');
        this.userName.textContent = 'JménoA';

        this.toggleDropdown.append(this.userName);

        this.dropdownUL = createElement('ul', ['dropdown-menu', 'dropdown-menu-end']);
        this.dropdownUL.setAttribute('aria-labelledby', "navbarDropdown");
        this.dropdownUL.innerHTML = '<li><a class="dropdown-item" href="#/settings">Nastavení</a></li>';
        this.dropdownUL.innerHTML += '<li><a class="dropdown-item" onclick="alert(\'ANO\');">Odhlásit se!</a></li>';

        this.userMenuLI.append(this.toggleDropdown, this.dropdownUL);
        this.userMenuUL.append(this.userMenuLI);

        this.nav.append(this.title, this.toggleButton, this.resources, this.userMenuUL);
        this.app.append(this.nav);

        this.isDelivered = false;
    }


    displayUserName(settings) {
        this.userName.textContent = settings.userName;
    }

    displayTownName(settings) {
        this.title.textContent = settings.townName;
    }

    displayResources(settings, data, deliveryHandler) {
        let nextDelivery = new Date();
        const index = data.findIndex((b) => b.link === 'gold-mine');
        this.displayRes(nextDelivery, settings);
        setTimeout(() => {this.isDelivered = false;}, 1000);
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
    
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.onGameInfoDisplay(this.model.settings, this.model.data, this.onDelivery);
    }

    onGameInfoDisplay = (settings, data, deliveryHandler) => {
        this.view.displayUserName(settings);
        this.view.displayTownName(settings);
        this.view.displayResources(settings, data, deliveryHandler);
    }

    onDelivery = (gold) => {
        this.model.bindDelivery(gold);
    }
}

export function buildNavigation(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}
