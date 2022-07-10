export function displayBuildTime(t, date = null) {
    if (date !== null) {
        let currentDate = new Date();
        let buildDate = new Date(date);
        t = (buildDate - currentDate) / 1000;
        if (buildDate <= currentDate) return "Dokončeno";
    }
    if (t < 0) t = 0;
    const sec = parseInt(t, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return hours + ':' + minutes + ':' + seconds;
}

export function createElement(tag, className) {
    const el = document.createElement(tag);
    if (className) {
        for (const cN of className) {
            el.classList.add(cN);
        }
    }
    return el;
}

export function getElement(selector) {
    const el = document.querySelector(selector);
    return el;
}

export function serverTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = formatTime(m);
    s = formatTime(s);
    document.getElementById('serverTime').innerHTML = h + ":" + m + ":" + s;
    setTimeout(serverTime, 100);
}

function formatTime(t) {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
}

export function fight(userArmy, enemyArmy) {
    let uA = { ...userArmy };
    let eA = enemyArmy;
    userArmy.horsemans -= enemyArmy;
    if (userArmy.horsemans < 0) {
        userArmy.horsemans = 0;
    } else {
        enemyArmy -= userArmy.horsemans;
    }
    if (enemyArmy > 0) {
        userArmy.archers -= enemyArmy;
        if (userArmy.archers < 0) {
            userArmy.archers = 0;
        } else {
            enemyArmy -= uA.archers;
        }
    }
    if (enemyArmy > 0) {
        userArmy.swordsmans -= enemyArmy;
        if (userArmy.swordsmans < 0) {
            userArmy.swordsmans = 0;
        } else {
            enemyArmy -= uA.swordsmans;
        }
    }
    return {userArmy, enemyArmy};
}

export function save(data) {
    let d = JSON.stringify(data);
    localStorage.setItem('_gameData', d);
}

export function load() {
    let d = localStorage.getItem('_gameData');
    return JSON.parse(d);
}

export function timeDiffCalc(dateNow, dateStart) {
    let diffInMill = Math.abs(dateNow - dateStart) / 1000;

    const hours = Math.floor(diffInMill / 3600);
    diffInMill -= hours * 3600;

    return hours;
}