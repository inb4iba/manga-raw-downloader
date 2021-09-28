const ipc = require("electron").ipcRenderer;

const status = document.getElementById("statusText");
const mangaSite = document.getElementById("manga_site");
const mangaUrl = document.getElementById("manga_url");
const pages = document.getElementById("pages");
const pathInput = document.getElementById("path");
const downloadBtn = document.getElementById("download");
const pathBtn = document.getElementById("dir");

pathBtn.addEventListener("click", (event) => {
  ipc.send("open-file-dialog");
});

downloadBtn.addEventListener("click", (event) => {
  if (mangaSite.value && mangaUrl.value && pages.value) {
    status.textContent = "Processing...";
    status.className = "";
    ipc.send("download-images", {
      site: mangaSite.value,
      chapter: mangaUrl.value,
      pages: pages.value,
      downloadPath: pathInput.value,
    });
  } else {
    status.textContent = "Some fields are empty.";
    status.className = "fail";
  }
});

mangaSite.addEventListener("change", (event) => {
  const pagesDisMsg = "Pages disabled, all pages gonna be downloaded!";

  if (mangaSite.value === "site2") {
    status.textContent = pagesDisMsg;
    status.className = "start";
    pages.value = 999999999999;
    pages.disabled = true;
  } else {
    if (status.textContent === pagesDisMsg) {
      status.textContent = "Pages enabled!";
    }
    pages.value = "";
    pages.disabled = false;
  }
});

ipc.on("selected-file", (event, path) => {
  pathInput.value = path.filePaths[0];
  downloadBtn.disabled = false;
});

ipc.on("download-start", () => {
  status.textContent = "Download started...";
  status.className = "start";
});

ipc.on("download-success", () => {
  status.textContent = "Download finished!";
  status.className = "success";
});

ipc.on("download-fail", () => {
  status.textContent = "Download failed!!! Check everything and try again";
  status.className = "fail";
});
