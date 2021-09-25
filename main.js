const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { app, BrowserWindow } = require("electron");
const ipc = require("electron").ipcMain;
const dialog = require("electron").dialog;

let win;

function createWindow() {
  win = new BrowserWindow({
    title: "Manga Raw Downloader",
    width: 400,
    height: 600,
    resizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipc.on("close", (event, arg) => {
  app.quit();
});

ipc.on("open-file-dialog", async (event) => {
  let choosenFolder = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });

  if (choosenFolder.filePaths.length > 0) {
    event.sender.send("selected-file", choosenFolder);
  }
});

ipc.on("download-images", (event, args) => {
  downloadImages(args);
});

async function downloadImages(args) {
  const chapterRegex = /[^/]+$/;
  let { site, chapter, pages, downloadPath } = args;
  let url = getURL(site, chapter);

  const dir = `${downloadPath}/${chapter.match(chapterRegex, "")[0]}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  for (let i = 1; i <= pages; i++) {
    console.log(`${url}/${i}`);
    const fileName = i.toString().padStart(2, "0");
    const localFilePath = path.resolve(dir, fileName + ".jpg");
    try {
      const response = await axios({
        method: "GET",
        url: `${url}/${i}`,
        responseType: "stream",
      });

      const w = response.data.pipe(fs.createWriteStream(localFilePath));
      w.on("finish", () => {
        console.log("Successfully downloaded file!");
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  console.log("LOOP COMPLETE!!");
}

function getURL(site, chapter) {
  switch (site) {
    case "site1": {
      return "https://rawmanga.top/viewer/" + chapter.replace(/.+top\//, "");
    }
  }
  return "";
}
