import { buildNavigation as navigation } from "./navigation.js";
import { getData } from "./data.js";

const root = getElement('#root');

//navigation
const nav = createElement('nav', ['sb-topnav', 'navbar', 'navbar-expand', 'navbar-dark', 'bg-dark']);
nav.id = "mvc-model";

root.append(nav);
//root.removeChild(nav);

navigation('#mvc-model', getData());






function createElement(tag, className) {
    const el = document.createElement(tag);
    if (className) {
        for (const cN of className) {
            el.classList.add(cN);   
        }
    }
    return el;
}
function getElement(selector) {
    const element = document.querySelector(selector); 
    return element;
}