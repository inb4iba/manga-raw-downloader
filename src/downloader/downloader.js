const fs = require("fs");
const path = require("path");

const rawkuma = require("./sites/rawkuma");
const rawmanga = require("./sites/rawmanga");

module.exports = {
  async downloadImages(event, args) {
    let { site, chapter, pages, downloadPath } = args;
    const url = getURL(site, chapter);

    const chapterLinkRegex = /[^/]+$/;
    chapter = chapter.replace(/\/$/, "");
    const dir = `${downloadPath}/${chapter.match(chapterLinkRegex)[0]}`;

    const promises = await getPromisesArray(site, pages, url);

    if (promises && !fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    if (promises && promises.length > 0) {
      event.sender.send("download-start");

      Promise.all(promises)
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            const fileName = (i + 1).toString().padStart(2, "0");
            const localFilePath = path.resolve(dir, fileName + ".jpg");
            const writer = res[i].data.pipe(
              fs.createWriteStream(localFilePath)
            );

            writer.on("finish", () => {
              if (fileName === "01") {
                console.log("Download complete");
                event.sender.send("download-success");
              }
            });
          }
        })
        .catch((e) => {
          event.sender.send("download-fail");
          console.error(e);
        });
    } else {
      console.log("promises treta");
    }
  },
};

function getURL(site, chapter) {
  switch (site) {
    case "site1": {
      return "https://rawmanga.top/viewer/" + chapter.replace(/.+top\//, "");
    }
    case "site2": {
      return "https://rawkuma.com/" + chapter.replace(/.+.com\//, "");
    }
  }
  return "";
}

async function getPromisesArray(site, pages, url) {
  switch (site) {
    case "site1": {
      return rawmanga.getPromisesArray(pages, url);
    }
    case "site2": {
      return await rawkuma.getPromisesArray(url);
    }
  }
  return null;
}
