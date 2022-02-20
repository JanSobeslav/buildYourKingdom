import { getElement, createElement } from "./glMethods.js";

class Model {
    constructor(data) {
        this.data = data.data;
        this.settings = data.settings;
    }
    
}

class View {
    constructor(elName) {
        this.app = getElement(elName);
        //nav
        this.nav = createElement('nav', ['sb-topnav', 'navbar', 'navbar-expand', 'navbar-dark', 'bg-dark']);
        //title
        this.title = createElement('a', ['navbar-brand', 'ps-3']);
        this.title.textContent = 'Název města MVC';
        this.title.addEventListener('click', event => { location.reload(); });
        //toggleButton
        this.toggleButton = createElement('button', ['btn', 'btn-link', 'btn-sm', 'order-1', 'order-lg-0', 'me-4', 'me-lg-0']);
        this.toggleButton.id = 'sidebarToggle';
        this.toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        //userMenu
        this.userMenuUL = createElement('ul', ['navbar-nav', 'ms-auto', 'ms-auto', 'me-0', 'me-md-3', 'my-2', 'my-md-0', 'd-none', 'd-md-inline-block', 'form-inline']);
        this.userMenuLI = createElement('li', ['nav-item', 'dropdown']);
        
        this.toggleDropdown = createElement('a', ['nav-link', 'dropdown-toggle']);
        this.toggleDropdown.id = 'navbarDropdown';
        this.toggleDropdown.setAttribute('role', 'button');
        this.toggleDropdown.setAttribute('data-bs-toggle', 'dropdown');
        this.toggleDropdown.innerHTML = '<i class="fas fa-user fa-fw"></i> ';
        
        this.userName = createElement('span', 'userNameMenu');
        this.userName.textContent = 'JménoA';

        this.toggleDropdown.append(this.userName);

        this.dropdownUL = createElement('ul', ['dropdown-menu', 'dropdown-menu-end']);
        this.dropdownUL.setAttribute('aria-labelledby', "navbarDropdown");
        this.dropdownUL.innerHTML = '<li><a class="dropdown-item" href="#/settings">Nastavení</a></li>';
        this.dropdownUL.innerHTML += '<li><a class="dropdown-item" onclick="alert(\'ANO\');">Odhlásit se!</a></li>';
        
        this.userMenuLI.append(this.toggleDropdown, this.dropdownUL);
        this.userMenuUL.append(this.userMenuLI);

        this.nav.append(this.title, this.toggleButton, this.userMenuUL);
        this.app.append(this.nav);
    }
    

    displayUserName(settings) {
        this.userName.textContent = settings.userName;
    }

    displayTownName(settings) {
        this.title.textContent = settings.townName;
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.onGameInfoDisplay(this.model.settings);
    }

    onGameInfoDisplay = settings => {
        this.view.displayUserName(settings);
        this.view.displayTownName(settings);
    }
}

export function buildNavigation(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}
