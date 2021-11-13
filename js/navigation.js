class Model {
    constructor(data) {
        this.data = data.data;
        this.settings = data.settings;
    }
    
    bindUserNameChanged(callback) {
        this.onGameInfoChange = callback;
      }
}

class View {
    constructor(elName) {
        this.app = this.getElement(elName);
        this.title = this.createElement('a', ['navbar-brand', 'ps-3']);
        this.title.textContent = 'Název města MVC';
        this.title.addEventListener('click', event => { location.reload(); });

        this.toggleButton = this.createElement('button', ['btn', 'btn-link', 'btn-sm', 'order-1', 'order-lg-0', 'me-4', 'me-lg-0']);
        this.toggleButton.id = 'sidebarToggle';
        this.toggleButton.innerHTML = '<i class="fas fa-bars"></i>';

        this.userMenuUL = this.createElement('ul', ['navbar-nav', 'ms-auto', 'ms-auto', 'me-0', 'me-md-3', 'my-2', 'my-md-0', 'd-none', 'd-md-inline-block', 'form-inline']);
        this.userMenuLI = this.createElement('li', ['nav-item', 'dropdown']);
        this.toggleDropdown = this.createElement('a', ['nav-link', 'dropdown-toggle']);
        this.toggleDropdown.id = 'navbarDropdown';
        this.toggleDropdown.setAttribute('role', 'button');
        this.toggleDropdown.setAttribute('data-bs-toggle', 'dropdown');
        this.toggleDropdown.innerHTML = '<i class="fas fa-user fa-fw"></i> ';
        this.userName = this.createElement('span', 'userNameMenu');
        this.userName.textContent = 'JménoA';
        this.toggleDropdown.append(this.userName);
        this.dropdownUL = this.createElement('ul', ['dropdown-menu', 'dropdown-menu-end']);
        this.dropdownUL.setAttribute('aria-labelledby', "navbarDropdown");
        this.dropdownUL.innerHTML = '<li><a class="dropdown-item" href="#/settings">Nastavení</a></li>';
        this.dropdownUL.innerHTML += '<li><a class="dropdown-item" onclick="alert(\'ANO\');">Odhlásit se!</a></li>';
        this.userMenuLI.append(this.toggleDropdown, this.dropdownUL);
        this.userMenuUL.append(this.userMenuLI);

        this.app.append(this.title, this.toggleButton, this.userMenuUL);
    }
    createElement(tag, className) {
        const el = document.createElement(tag);
        if (className) {
            for (const cN of className) {
                el.classList.add(cN);
            }
        }
        return el;
    }
    getElement(selector) {
        const el = document.querySelector(selector);
        return el;
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

        this.model.bindUserNameChanged(this.onGameInfoChange);

        this.onGameInfoChange(this.model.settings);
    }

    onGameInfoChange = settings => {
        this.view.displayUserName(settings);
        this.view.displayTownName(settings);
    }
}

export function buildNavigation(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}
