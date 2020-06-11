import {browserTest} from "./browser";
export {reject} from "./reject";

const browserSpec = browserTest(navigator.userAgent);

document.querySelector<HTMLElement>('html')!.classList.add(browserSpec.os.name,
    browserSpec.browser.name, browserSpec.browser.className,
    browserSpec.layout.name, browserSpec.layout.className);

export const os = browserSpec.os;
export const layout = browserSpec.layout;
export const browser = browserSpec.browser;