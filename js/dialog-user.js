import { createElement, getElement, save } from "./glFunctions.js";
import { buildNavigation as nav } from "./navigation.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    changeUserName(name) {
        this.settings.userName = name;
        save({ data: this.data, settings: this.settings });
    }

}

class View {
    constructor(elName) {
        this.app = getElement(elName);

        this.dialog = createElement('dialog');
        this.dialog.id = 'dialog-modal';
        this.dialog.style.width = '100%';

        this.modal = createElement('div', ["modal-dialog"]);
        this.modalCont = createElement('div', ["modal-content"]);

        this.modalHeader = createElement('div', ["modal-header"]);
        this.modalHeaderTitle = createElement('h5', ["modal-title"]);
        this.modalHeaderTitle.innerHTML = '<h3>Nová hra</h3>Zadejte uživatelské jméno';

        this.modalHeader.append(this.modalHeaderTitle);

        this.modalContBody = createElement('div', ["modal-body"]);
        this.inputGroup = createElement('div', ['input-group']);
        this.inputUserName = createElement('input', ['form-control']);
        this.inputUserName.type = 'text';
        this.inputUserName.placeholder = "Zadejte jméno max. 7 znaků dlouhé";
        this.btnConfirm = createElement('button', ['btn', 'btn-primary']);
        this.btnConfirm.innerHTML = 'Potvrdit';

        this.inputGroup.append(this.inputUserName, this.btnConfirm);

        this.modalContBody.append(this.inputGroup);

        this.modalCont.append(this.modalHeader, this.modalContBody);

        this.modal.append(this.modalCont);

        this.dialog.append(this.modal);

        this.app.append(this.dialog);

        this.dialog.showModal();
    }

    bindCreateNewUser(data, handleNewUser) {
        this.btnConfirm.addEventListener('click', () => {
            if (this.inputUserName.value.trim().length >= 7) {
                this.inputUserName.style.color = 'red';
                this.btnConfirm.disabled = true;
                setTimeout(() => {
                    this.inputUserName.style.color = 'black';
                    this.btnConfirm.disabled = false;
                }, 1000);
            } else {
                this.inputUserName.style.color = 'black';
                handleNewUser(this.inputUserName.value);
                getElement('#game-navigation').innerHTML = '';
                nav('#game-navigation', data);
                this.dialog.close();
            }

        });
    }

}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.view.bindCreateNewUser({ data: this.model.data, settings: this.model.settings }, this.handleConfirm);
    }

    handleConfirm = (name) => {
        this.model.changeUserName(name);
    }

}

export function buildDialogNewUser(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}