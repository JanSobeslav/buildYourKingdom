import { buildNavigation as navigation } from "./navigation.js";
import { getData } from "./data.js";
import { getElement, createElement } from "./glMethods.js";
import { buildSidebar as sidebar } from "./sidebar.js";

const root = getElement('#root');

//navigation
navigation('#root', getData());
//sidenav
sidebar('#root', getData());
//event

//root.removeChild(nav);