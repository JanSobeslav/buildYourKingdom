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