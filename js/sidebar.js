import { createElement, getElement } from "./elements.js";
import { getData } from "./data.js";
import { buildCastle as castle } from "./castle.js";
import { buildGoldMine as mine } from "./gold-mine.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    bindMenuItemsChange(callback) {
        this.onMenuItemsChange = callback;
    }

    linkChange(link) {
        this.settings.activeLink = link;
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);
        //root of sidebar
        this.sidenav = createElement('div');
        this.sidenav.id = 'layoutSidenav';
        this.side_nav = createElement('div');
        this.side_nav.id = 'layoutSidenav_nav';
        //nav
        this.nav = createElement('nav', ['sb-sidenav', 'accordion', 'sb-sidenav-dark']);
        this.nav.id = 'sidenavAccordion';
        //nav-menu
        this.navMenu = createElement('div', ['sb-sidenav-menu']);
        //menu
        this.menu = createElement('div', ['nav']);
        //menu items
        //### NAČÍST MENU
        this.navMenu.append(this.menu);
        this.nav.append(this.navMenu);
        this.side_nav.append(this.nav);

        this.side_content = createElement('div');
        this.side_content.id = 'layoutSidenav_content';
        this.contentMain = createElement('main');
        this.contentMain.id = 'content';
        this.side_content.append(this.contentMain);
        this.sidenav.append(this.side_nav, this.side_content);
        //

        this.app.append(this.sidenav);

        this._temporaryItemsLinks = [];
    }

    _initItemsLink(link) {
        this._temporaryItemsLinks.push(link);
    }

    displaySidenavItems(data, settings) {
        const menuHeading = createElement('div', ['sb-sidenav-menu-heading']);
        menuHeading.textContent = 'Budovy';
        this.menu.append(menuHeading);
        for (const d of data) {
            const a = createElement('a', ['nav-link', d.link]);
            a.href = '#/' + d.link;
            if (settings.activeLink === d.link) {
                a.classList.add('active');
            }
            a.innerHTML = '<div class="sb-nav-link-icon"><i class="' + d.icon + '"></i></div>' + d.name;
            this.menu.append(a);
            this._initItemsLink(d.link);
        }
    }

    bindLinkChange(handler) {
        //projde linky v _temporaryItemsLinks
        for (let link of this._temporaryItemsLinks) {
            //najde konkrétní link s třídou
            let a = getElement('.' + link);
            //přidá event click na tento el
            a.addEventListener('click', event => {
                //nalezne všechny a elementy
                let aLinks = document.getElementsByTagName('a');
                //odstraní třídu active
                for (let aL of aLinks) {
                    aL.classList.remove("active");
                }
                //pokud se target rovná konkrétní třídě
                if (event.target.className === ('nav-link ' + link)) {
                    //najde element s id content, odstraní z něj veškeré children a vloží konrétní komponentu
                    let content = getElement('#content');
                    if (content.childNodes.length > 0) {
                        content.removeChild(content.firstChild);
                    }
                    a.classList.add("active");
                    handler(link);
                    this.displayContent(link, content.id);
                } else {
                    a.classList.remove("active");
                }
            });
        }
    }

    displayContent(link, id) {
        switch (link) {
            case 'castle':
                castle(('#' + id), getData());
                break;
            case 'gold-mine':
                mine(('#' + id), getData());
                break;
        }
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.model.bindMenuItemsChange(this.onMenuItemsChange);
        this.onMenuItemsChange(this.model.data, this.model.settings);
        this.view.bindLinkChange(this.handleLinkChange);
    }

    onMenuItemsChange = (data, settings) => {
        this.view.displaySidenavItems(data, settings);
    }

    handleLinkChange = (link) => {
        this.model.linkChange(link);
    }
}

export function buildSidebar(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}