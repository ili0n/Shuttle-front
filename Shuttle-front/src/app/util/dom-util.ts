/**
 * Asynchroniously wait for element to be present in the DOM tree.
 * @param selector CSS Selector of the DOM element.
 * @returns A `Promise` in which you can call code once the element is present.
 */
export function waitForElement(selector: string) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
