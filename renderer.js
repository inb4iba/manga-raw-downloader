const ipc = require("electron").ipcRenderer;

document.getElementById("dir").addEventListener("click", (event) => {
  ipc.send("open-file-dialog");
});

document.getElementById("download").addEventListener("click", (event) => {
  ipc.send("download-images", {
    site: document.getElementById("manga_site").value,
    chapter: document.getElementById("manga_url").value,
    pages: document.getElementById("pages").value,
    downloadPath: document.getElementById("path").value,
  });
});

ipc.on("selected-file", (event, path) => {
  console.log(path);
  document.getElementById("path").value = path.filePaths[0];
});
