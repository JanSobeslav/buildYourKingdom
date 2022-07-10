import { createElement, getElement, save, serverTime } from "./glFunctions.js";
import { getData } from "./data.js";
import { buildCastle as castle } from "./castle.js";
import { buildGoldMine as mine } from "./gold-mine.js";
import { buildBarracks as barracks } from "./barracks.js";
import { buildMint as mint } from "./mint.js";

class Model {
    constructor(data) {
        this.allData = data;
        this.data = data.data;
        this.settings = data.settings;
    }

    changeMenuItems(callback) {
        this.handleMenuItemsChange = callback;
        save({ data: this.data, settings: this.settings });
    }

    linkChange(link) {
        this.settings.activeLink = link;
        save({ data: this.data, settings: this.settings });
    }
    startGame() {
        if (!this.settings.startGameDate) {
            this.settings.startGameDate = new Date();
        }
    }
}

class View {
    constructor(elName) {
        this.app = getElement(elName);
        this.sidenav = createElement('div');
        this.sidenav.id = 'layoutSidenav';
        this.side_nav = createElement('div');
        this.side_nav.id = 'layoutSidenav_nav';
        this.nav = createElement('nav', ['sb-sidenav', 'accordion', 'sb-sidenav-dark']);
        this.nav.id = 'sidenavAccordion';
        this.navMenu = createElement('div', ['sb-sidenav-menu']);
        this.menu = createElement('div', ['nav']);
        this.navMenu.append(this.menu);
        this.nav.append(this.navMenu);
        this.side_nav.append(this.nav);

        this.side_content = createElement('div');
        this.side_content.id = 'layoutSidenav_content';
        this.contentMain = createElement('main');
        this.contentMain.id = 'content';

        this.svTime = createElement('span', ['text-muted']);
        this.svTime.setAttribute('style', 'margin-left: 1%; margin-top: 1%;');
        this.svTime.innerHTML = `<small>Čas: <span id="serverTime"></span></small>`;

        this.side_content.append(this.contentMain, this.svTime);
        this.sidenav.append(this.side_nav, this.side_content);

        this.app.append(this.sidenav);
    }

    bindDisplaySidenavItems(data, settings) {
        const menuHeading = createElement('div', ['sb-sidenav-menu-heading']);
        menuHeading.textContent = 'Budovy';
        this.menu.append(menuHeading);
        let activeLink = settings.activeLink;
        let urlAddress = window.location.href;
        let [urlBef, urlLink] = urlAddress.split('/#/');
        if (urlLink && (activeLink !== urlLink)) activeLink = urlLink;
        for (const d of data) {
            const a = createElement('a', ['nav-link', d.link]);
            a.href = '#/' + d.link;
            if (activeLink === d.link) {
                a.classList.add('active');
            }
            a.innerHTML = '<div class="sb-nav-link-icon"><i class="' + d.icon + '"></i></div>' + d.name;
            this.menu.append(a);
        }
        const [building] = data.filter(b => b.link === activeLink);
        this.displayContent(building);
        getElement('#serverTime').innerHTML = serverTime();
    }

    bindLinkChange(linkChangeHandler, data) {
        for (let d of data) {
            let a = getElement('.' + d.link);
            a.addEventListener('click', () => {
                let aLinks = document.getElementsByTagName('a');
                for (let aL of aLinks) { aL.classList.remove("active"); }
                if (a.className === ('nav-link ' + d.link)) {
                    a.classList.add("active");
                    linkChangeHandler(d.link);
                    this.displayContent(d);
                } else {
                    a.classList.remove("active");
                }
            });
        }
    }

    displayContent(building) {
        getElement('#content').innerHTML = '';
        if (building.level > 0) {
            switch (building.link) {
                case 'castle':
                    castle(('#content'), getData());
                    break;
                case 'gold-mine':
                    mine(('#content'), getData());
                    break;
                case 'barracks':
                    barracks(('#content'), getData());
                    break;
                case 'mint':
                    mint(('#content'), getData());
                    break;
            }
        } else {
            getElement('#content').innerHTML = `<h2 class="display-4 m-5">Budova dosud nebyla postavena!</h2>`;
        }
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.model.changeMenuItems(this.handleMenuItemsChange);
        this.model.startGame();
        this.handleMenuItemsChange(this.model.data, this.model.settings);
        this.view.bindLinkChange(this.handleLinkChange, this.model.data);
    }

    handleMenuItemsChange = (data, settings) => {
        this.view.bindDisplaySidenavItems(data, settings);
    }

    handleLinkChange = (link) => {
        this.model.linkChange(link);
    }
}

export function buildSidebar(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}