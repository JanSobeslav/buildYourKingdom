import { buildNavigation as navigation } from "./navigation.js";
import { getData, setData } from "./data.js";
import { getElement, createElement, save, load } from "./glMethods.js";
import { buildSidebar as sidebar } from "./sidebar.js";
import { buildDialogNewUser } from "./dialog-user.js";

const root = getElement('#root');

if (localStorage.getItem("_gameData") !== null) {
    setData(load());
} else {
    buildDialogNewUser('#root', getData());
    save(getData());
}

//navigation
navigation('#root', getData());
//sidenav
sidebar('#root', getData());
//event

//root.removeChild(nav);