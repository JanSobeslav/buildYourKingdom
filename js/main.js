import { buildNavigation as navigation } from "./navigation.js";
import { getData, setData } from "./data.js";
import { getElement, save, load } from "./glFunctions.js";
import { buildSidebar as sidebar } from "./sidebar.js";

const root = getElement('#root');

if (localStorage.getItem("_gameData") !== null) {
    setData(load());
} else {
    save(getData());
}

navigation('#root', getData());
sidebar('#root', getData());