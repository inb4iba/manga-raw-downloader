const { app, BrowserWindow } = require("electron");
const dialog = require("electron").dialog;
const ipc = require("electron").ipcMain;

const downloader = require("./downloader/downloader");

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
  downloader.downloadImages(event, args);
});
