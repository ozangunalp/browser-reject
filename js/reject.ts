/*!
 * Browser Reject
 * Adapted By: Ozan Gunalp
 * Adapted From: jReject (jQuery Browser Rejection Plugin) URL: http://jreject.turnwheel.com/
 */
import { merge } from './utils';
import { browserTest } from './browser';

// Based on compatibility data from quirksmode.com
// This is used to help calculate exact center of the page
export const _pageSize = function () {
  const xScroll =
    window.innerWidth && (window as any).scrollMaxX
      ? window.innerWidth + (window as any).scrollMaxX
      : document.body.scrollWidth > document.body.offsetWidth
      ? document.body.scrollWidth
      : document.body.offsetWidth;

  const yScroll =
    window.innerHeight && (window as any).scrollMaxY
      ? window.innerHeight + (window as any).scrollMaxY
      : document.body.scrollHeight > document.body.offsetHeight
      ? document.body.scrollHeight
      : document.body.offsetHeight;

  const windowWidth = window.innerWidth
    ? window.innerWidth
    : document.documentElement && document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : document.body.clientWidth;

  const windowHeight = window.innerHeight
    ? window.innerHeight
    : document.documentElement && document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : document.body.clientHeight;

  return [
    xScroll < windowWidth ? xScroll : windowWidth, // Page Width
    yScroll < windowHeight ? windowHeight : yScroll, // Page Height
    windowWidth,
    windowHeight,
  ];
};

// Based on compatibility data from quirksmode.com
export const _scrollSize = function () {
  return [
    // scrollSize X
    window.pageXOffset
      ? window.pageXOffset
      : document.documentElement && document.documentElement.scrollTop
      ? document.documentElement.scrollLeft
      : document.body.scrollLeft,

    // scrollSize Y
    window.pageYOffset
      ? window.pageYOffset
      : document.documentElement && document.documentElement.scrollTop
      ? document.documentElement.scrollTop
      : document.body.scrollTop,
  ];
};

// Local global setting for the name of the cookie used
const COOKIE_NAME = 'jreject-close';

// Cookies Function: Handles creating/retrieving/deleting cookies
// Cookies are only used for opts.closeCookie parameter functionality
export const _cookie = function (name: string, opts: Options, value?: boolean) {
  // Save cookie
  if (typeof value != 'undefined') {
    let expires = '';

    // Check if we need to set an expiration date
    if (opts.cookieSettings.expires !== 0) {
      const date = new Date();
      date.setTime(date.getTime() + opts.cookieSettings.expires * 1000);
      expires = '; expires=' + date.toUTCString();
    }

    // Get path from settings
    const path = opts.cookieSettings.path || '/';

    // Set Cookie with parameters
    document.cookie = name + '=' + encodeURIComponent(!value ? '' : value) + expires + '; path=' + path;

    return true;
  }
  // Get cookie
  else {
    let cookie,
      val = null;

    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');

      // Loop through all cookie values
      const clen = cookies.length;
      for (let i = 0; i < clen; ++i) {
        cookie = cookies[i].trim();

        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == name + '=') {
          const len = name.length;
          val = decodeURIComponent(cookie.substring(len + 1));
          break;
        }
      }
    }

    // Returns cookie value
    return val;
  }
};

interface Options {
  closeCookie: boolean;
  imagePath: string;
  display: string[];
  closeLink: string;
  browserShow: boolean;
  cookieSettings: {
    path: string;
    expires: number;
  };
  paragraph1: string;
  paragraph2: string;
  fadeInTime: string;
  analytics: boolean;
  closeMessage: string;
  closeURL: string;
  reject: {
    all: boolean;
    [browser: string]: number | boolean;
  };
  header: string;
  overlayBgColor: string;
  close: boolean;
  fadeOutTime: string;
  browserInfo: {
    msie: {
      text: string;
      url: string;
    };
    opera: {
      text: string;
      url: string;
    };
    chrome: {
      text: string;
      url: string;
    };
    safari: {
      text: string;
      url: string;
    };
    firefox: {
      text: string;
      url: string;
    };
  };
  overlayOpacity: number;
  closeESC: boolean;
  beforeReject?: () => void;
  afterReject?: () => void;
  onFail?: () => void;
  beforeClose?: () => void;
  afterClose?: () => void;
}

export const reject = function (options?: Options): boolean {
  const opts: Options = merge(
    {
      // Specifies which browsers/versions will be blocked
      reject: {
        all: false, // Covers Everything (Nothing blocked)
        msie: 6, // Covers MSIE <= 6 (Blocked by default)
        /*
         * Many possible combinations.
         * You can specify browser (msie, chrome, firefox)
         * You can specify rendering engine (geko, trident)
         * You can specify OS (Win, Mac, Linux, Solaris, iPhone, iPad)
         *
         * You can specify versions of each.
         * Examples: msie9: true, firefox8: true,
         *
         * You can specify the highest number to reject.
         * Example: msie: 9 (9 and lower are rejected.
         *
         * There is also "unknown" that covers what isn't detected
         * Example: unknown: true
         */
      },
      display: [], // What browsers to display and their order (default set below)
      browserShow: true, // Should the browser options be shown?
      browserInfo: {
        // Settings for which browsers to display
        chrome: {
          // Text below the icon
          text: 'Google Chrome',
          // URL For icon/text link
          url: 'http://www.google.com/chrome/',
          // (Optional) Use "allow" to customized when to show this option
          // Example: to show chrome only for IE users
          // allow: { all: false, msie: true }
        },
        firefox: {
          text: 'Mozilla Firefox',
          url: 'http://www.mozilla.com/firefox/',
        },
        safari: {
          text: 'Safari',
          url: 'http://www.apple.com/safari/download/',
        },
        opera: {
          text: 'Opera',
          url: 'http://www.opera.com/download/',
        },
        msie: {
          text: 'Internet Explorer',
          url: 'http://www.microsoft.com/windows/Internet-explorer/',
        },
      },

      // Pop-up Window Text
      header: 'Did you know that your Internet Browser is out of date?',

      paragraph1:
        'Your browser is out of date, and may not be compatible with ' +
        'our website. A list of the most popular web browsers can be ' +
        'found below.',

      paragraph2: 'Just click on the icons to get to the download page',

      // Allow closing of window
      close: true,

      // Message displayed below closing link
      closeMessage: 'By closing this window you acknowledge that your experience ' + 'on this website may be degraded',
      closeLink: 'Close This Window',
      closeURL: '#',

      // Allows closing of window with esc key
      closeESC: true,

      // Use cookies to remmember if window was closed previously?
      closeCookie: false,
      // Cookie settings are only used if closeCookie is true
      cookieSettings: {
        // Path for the cookie to be saved on
        // Should be root domain in most cases
        path: '/',
        // Expiration Date (in seconds)
        // 0 (default) means it ends with the current session
        expires: 0,
      },

      // Path where images are located
      imagePath: './images/',
      // Background color for overlay
      overlayBgColor: '#000',
      // Background transparency (0-1)
      overlayOpacity: 0.8,

      // Fade in time on open ('slow','medium','fast' or integer in ms)
      fadeInTime: 'fast',
      // Fade out time on close ('slow','medium','fast' or integer in ms)
      fadeOutTime: 'fast',

      // Google Analytics Link Tracking (Optional)
      // Set to true to enable
      // Note: Analytics tracking code must be added separately
      analytics: false,
    },
    options
  );

  // Set default browsers to display if not already defined
  if (opts.display.length < 1) {
    opts.display = ['chrome', 'firefox', 'safari', 'opera', 'msie'];
  }

  // beforeRject: Customized Function
  if (opts.beforeReject) {
    opts.beforeReject();
  }

  // Disable 'closeESC' if closing is disabled (mutually exclusive)
  if (!opts.close) {
    opts.closeESC = false;
  }

  // This function parses the advanced browser options
  const browserCheck = function (settings: { all: boolean; [browser: string]: boolean | number }) {
    // Check 1: Look for 'all' forced setting
    // Check 2: Browser+major version (optional) (eg. 'firefox','msie','{msie: 6}')
    // Check 3: Browser+major version (eg. 'firefox3','msie7','chrome4')
    // Check 4: Rendering engine+version (eg. 'webkit', 'gecko', '{webkit: 537.36}')
    // Check 5: Operating System (eg. 'win','mac','linux','solaris','iphone')
    const test = browserTest(navigator.userAgent);
    const layout = settings[test.layout.name],
      browser = settings[test.browser.name];
    return !!(
      settings['all'] ||
      (browser && (browser === true || test.browser.versionNumber <= browser)) ||
      settings[test.browser.className] ||
      (layout && (layout === true || test.layout.versionNumber <= layout)) ||
      settings[test.os.name]
    );
  };

  // Determine if we need to display rejection for this browser, or exit
  if (!browserCheck(opts.reject)) {
    // onFail: Optional Callback
    if (opts.onFail) {
      opts.onFail();
    }

    return false;
  }

  // If user can close and set to remmember close, initiate cookie functions
  if (opts.close && opts.closeCookie) {
    // Local global setting for the name of the cookie used
    const COOKIE_NAME = 'jreject-close';

    // If cookie is set, return false and don't display rejection
    if (_cookie(COOKIE_NAME, opts)) {
      return false;
    }
  }

  // Load background overlay (jr_overlay) + Main wrapper (jr_wrap) +
  // Inner Wrapper (jr_inner) w/ opts.header (jr_header) +
  // opts.paragraph1/opts.paragraph2 if set
  let html =
    '<div id="jr_overlay"></div><div id="jr_wrap"><div id="jr_inner">' +
    '<h1 id="jr_header">' +
    opts.header +
    '</h1>' +
    (opts.paragraph1 === '' ? '' : '<p>' + opts.paragraph1 + '</p>') +
    (opts.paragraph2 === '' ? '' : '<p>' + opts.paragraph2 + '</p>');

  let displayNum = 0;
  if (opts.browserShow) {
    html += '<ul>';

    // Generate the browsers to display
    for (const x in opts.display) {
      const browser = opts.display[x]; // Current Browser
      const info = (opts.browserInfo as any)[browser] || false; // Browser Information

      // If no info exists for this browser
      // or if this browser is not suppose to display to this user
      // based on "allow" flag
      if (!info || (info['allow'] != undefined && !browserCheck(info['allow']))) {
        continue;
      }

      const url = info.url || '#'; // URL to link text/icon to

      // Generate HTML for this browser option
      html +=
        '<li id="jr_' +
        browser +
        '"><div class="jr_icon"></div>' +
        '<div><a href="' +
        url +
        '">' +
        (info.text || 'Unknown') +
        '</a>' +
        '</div></li>';

      ++displayNum;
    }

    html += '</ul>';
  }

  // Close list and #jr_list
  html +=
    '<div id="jr_close">' +
    // Display close links/message if set
    (opts.close
      ? '<a href="' + opts.closeURL + '">' + opts.closeLink + '</a>' + '<p>' + opts.closeMessage + '</p>'
      : '') +
    '</div>' +
    // Close #jr_inner and #jr_wrap
    '</div></div>';

  const element = document.createElement('div'); // Create element
  element.innerHTML = html;
  const size = _pageSize(); // Get page size
  const scroll = _scrollSize(); // Get page scroll

  // This function handles closing this reject window
  // When clicked, fadeOut and remove all elements
  element.addEventListener('closejr', function handler() {
    // Make sure the permission to close is granted
    if (!opts.close) {
      return false;
    }

    // Customized Function
    if (opts.beforeClose) {
      opts.beforeClose();
    }

    // Remove binding function so it
    // doesn't get called more than once
    element.removeEventListener('closejr', handler);

    // Fade out background and modal wrapper
    // TODO fadeout
    document.querySelectorAll('#jr_overlay,#jr_wrap').forEach((value) => {
      value.remove();
    });
    // afterClose: Customized Function
    if (opts.afterClose) {
      opts.afterClose();
    }

    // Show elements that were hidden for layering issues
    const elmhide = 'embed.jr_hidden, object.jr_hidden, select.jr_hidden, applet.jr_hidden';
    document.querySelectorAll(elmhide).forEach((value) => {
      value.classList.remove('jr_hidden');
    });

    // Set close cookie for next run
    if (opts.closeCookie) {
      _cookie(COOKIE_NAME, opts, true);
    }

    return true;
  });

  // Tracks clicks in Google Analytics (category 'External Links')
  // only if opts.analytics is enabled
  const analytics = function (url: string) {
    if (!opts.analytics) {
      return;
    }

    // Get just the hostname
    const host = url.split(/\/+/g)[1];

    // Send external link event to Google Analaytics
    // Attempts both versions of analytics code. (Newest first)
    try {
      // Newest analytics code
      (window as any).ga && (window as any).ga('send', 'event', 'External', 'Click', host, url);
    } catch (e) {
      try {
        (window as any)._gaq && (window as any)._gaq.push(['_trackEvent', 'External Links', host, url]);
      } catch (e) {}
    }
  };

  // Called onClick for browser links (and icons)
  // Opens link in new window
  const openBrowserLinks = function (url: string) {
    // Send link to analytics if enabled
    analytics(url);

    // Open window, generate random id value
    window.open(url, 'jr_' + Math.round(Math.random() * 11));

    return false;
  };

  /*
   * Trverse through element DOM and apply JS variables
   * All CSS elements that do not require JS will be in
   * css/jquery.jreject.css
   */

  // Creates 'background' (div)
  const overlay = element.querySelector<HTMLElement>('#jr_overlay')!;
  overlay.style.width = size[0] + 'px';
  overlay.style.height = size[1] + 'px';
  overlay.style.background = opts.overlayBgColor;
  overlay.style.opacity = '' + opts.overlayOpacity;

  // Wrapper for our pop-up (div)
  const wrap = element.querySelector<HTMLElement>('#jr_wrap')!;
  wrap.style.top = scroll[1] + size[3] / 4 + 'px';
  wrap.style.left = scroll[0] + 'px';

  // Wrapper for inner centered content (div)
  const inner = element.querySelector<HTMLElement>('#jr_inner')!;
  inner.style.minWidth = displayNum * 100 + 'px';
  inner.style.maxWidth = displayNum * 140 + 'px';
  // min/maxWidth not supported by IE
  // TODO $.layout.name == 'trident' ? displayNum * 155 : 'auto'
  inner.style.width = 'auto';

  // Browser list items (li)
  element.querySelectorAll<HTMLElement>('#jr_inner li').forEach((value) => {
    value.style.background =
      'transparent url("' + opts.imagePath + 'background_browser.gif") ' + 'no-repeat scroll left top';
  });

  element.querySelectorAll<HTMLElement>('#jr_inner li .jr_icon').forEach((value) => {
    // Dynamically sets the icon background image
    value.style.background =
      'transparent url(' +
      opts.imagePath +
      'browser_' +
      value.parentElement!.id.replace(/jr_/, '') +
      '.gif) no-repeat scroll left top';

    // Send link clicks to openBrowserLinks
    value.addEventListener('click', () => {
      const url = value.nextElementSibling!.querySelector('a')!.getAttribute('href')!;
      openBrowserLinks(url);
    });
  });

  element.querySelectorAll<HTMLElement>('#jr_inner li a').forEach((value) => {
    value.addEventListener('click', (e) => {
      openBrowserLinks(value.getAttribute('href')!);
      e.preventDefault();
    });
  });

  // Bind closing event to trigger closejr
  // to be consistant with ESC key close function
  const close = element.querySelector<HTMLElement>('#jr_close a');
  if (close) {
    close.addEventListener('click', () => {
      element.dispatchEvent(new Event('closejr'));

      // If plain anchor is set, return false so there is no page jump
      return opts.closeURL !== '#';
    });
  }

  // Hide elements that won't display properly
  document.querySelectorAll('embed, object, select, applet').forEach((element) => {
    element.classList.add('jr_hidden');
  });

  // Append element to body of document to display
  // TODO fade in element.hide().fadeIn(opts.fadeInTime)
  document.querySelector<HTMLElement>('body')!.append(element);

  // Set focus (fixes ESC key issues with forms and other focus bugs)
  document.querySelector<HTMLElement>('#jr_overlay')!.focus();

  // Handle window resize/scroll events and update overlay dimensions
  const moveHandler = () => {
    const size = _pageSize(); // Get size

    // Update overlay dimensions based on page size
    const overlay = document.querySelector<HTMLElement>('#jr_overlay');
    if (overlay) {
      overlay.style.width = size[0] + 'px';
      overlay.style.height = size[1] + 'px';
    }
    const scroll = _scrollSize(); // Get page scroll

    // Update modal position based on scroll
    const wrap = document.querySelector<HTMLElement>('#jr_wrap');
    if (wrap) {
      wrap.style.top = scroll[1] + size[3] / 4 + 'px';
      wrap.style.left = scroll[0] + 'px';
    }
  };
  window.addEventListener('resize', moveHandler);
  window.addEventListener('scroll', moveHandler);

  // Add optional ESC Key functionality
  if (opts.closeESC) {
    document.addEventListener('keydown', function (event) {
      // ESC = Keycode 27
      if (event.keyCode == 27) {
        element.dispatchEvent(new Event('closejr'));
      }
    });
  }

  // afterReject: Customized Function
  if (opts.afterReject) {
    opts.afterReject();
  }

  return true;
};
