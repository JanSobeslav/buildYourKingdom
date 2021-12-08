import { createElement, getElement } from "./elements.js";

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
        this.sidenav.append(this.side_nav);
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
        for (let link of this._temporaryItemsLinks) {
            let a = getElement('.' + link);
            a.addEventListener('click', event => {
            let aLinks = document.getElementsByTagName('a');
            for (let aL of aLinks) {
                aL.classList.remove("active");
            } 
            if (event.target.className === ('nav-link ' + link)) {
                //this.menu.innerHTML = '';
                a.classList.add("active");
                console.log(a);
                handler(link);
            } else {
                a.classList.remove("active");
            }
          });
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
        //this.onMenuItemsChange(this.model.data, this.model.settings);
    }
}

export function buildSidebar(elName, data) {
    const app = new Controller(new Model(data), new View(elName));
}