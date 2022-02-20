export function displayBuildTime(t) {
    if (t <= 15) t = 15;
    const sec = parseInt(t, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
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