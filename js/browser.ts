/*!
 * Browser Reject
 * Adapted By: Ozan Gunalp
 * Adapted From: jQuery Browser Plugin URL: http://jquery.thewikies.com/browser
 */
export interface Browser {
    browser: {
        name: string,
        className: string,
        version: string,
        versionNumber: number,
    },
    layout: {
        name: string
        className: string,
        version: string,
        versionNumber: number,
    }
    os: {
        name: string
    },
}

const u = 'unknown';

const m = function (r: string, h: (string | RegExp)[][]) {
    for (let i = 0; i < h.length; i = i + 1) {
        r = r.replace(h[i][0], h[i][1] as string);
    }

    return r;
}

const c = function (i: string, a: RegExp, b: (string | RegExp)[][], c: RegExp, browser?: {version: number}) {
    const x = 'X';
    const name = m((a.exec(i) || [u, u])[1], b);
    let version;

    if (name !== 'opera') {
        version = (c.exec(i) || [x, x, x, x])[3];
    } else {
        version = (window as any).opera.version();
    }

    if (/safari/.test(name)) {
        const safariversion = /(safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/;
        const res = safariversion.exec(i);
        if (res && res[3] && parseInt(res[3]) < 400) {
            version = '2.0';
        }
    } else if (name === 'presto') {
        version = (browser && browser.version > 9.27) ? 'futhark' : 'linear_b';
    }

    if (/msie/.test(name) && version === x) {
        version = /rv:(\d+\.\d+)/.exec(i)![1];
    }

    const versionNumber = parseFloat(version) || 0;
    const minorStart = (versionNumber < 100 && versionNumber > 9) ? 2 : 1;

    const versionX = (version !== x) ? version.substr(0, minorStart) : x;
    const className = name + versionX;

    return {
        [name]: true,
        name,
        className,
        version,
        versionNumber,
        versionX,
    };
};

export const browserTest = (userAgent: string): Browser => {
    const a = (/Opera|Navigator|Minefield|KHTML|Chrome|CriOS/.test(userAgent) ? m(userAgent, [
            [/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''],
            ['Chrome Safari', 'Chrome'],
            ['CriOS', 'Chrome'],
            ['KHTML', 'Konqueror'],
            ['Minefield', 'Firefox'],
            ['Navigator', 'Netscape']
        ]) : userAgent).toLowerCase();

    const browser = c(a,
        /(camino|chrome|crios|firefox|netscape|konqueror|lynx|msie|trident|opera|safari)/,
        [
            ['trident', 'msie']
        ],
        /(camino|chrome|crios|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|rv|safari)(:|\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/);
    return {
        browser,
        layout: c(a, /(gecko|konqueror|msie|trident|opera|webkit)/, [
            ['konqueror', 'khtml'],
            ['msie', 'trident'],
            ['opera', 'presto']
        ], /(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/, browser),

        os: {
            name: (/(win|mac|linux|sunos|solaris|iphone|ipad)/.exec(navigator.platform.toLowerCase()) || [u])[0].replace('sunos', 'solaris')
        }
    };
};
