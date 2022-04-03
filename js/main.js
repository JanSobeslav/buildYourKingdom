import { buildNavigation as navigation } from "./navigation.js";
import { getData } from "./data.js";
import { getElement, createElement } from "./glMethods.js";
import { buildSidebar as sidebar } from "./sidebar.js";
import { buildEventAttack as eventAttack } from "./eventAttack.js";

const root = getElement('#root');

//navigation
navigation('#root', getData());
//sidenav
sidebar('#root', getData());
//event
eventAttack('#root', getData());

//root.removeChild(nav);