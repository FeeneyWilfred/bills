const TARGET_URL = "https://google.com";

function isDesktopBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const mobilePattern = /Android|iPhone|iPad|iPod|Mobile|Windows Phone|webOS|BlackBerry/i;
  const coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  return !mobilePattern.test(ua) && !coarsePointer;
}

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
