const axios = require("axios");

module.exports = {
  getPromisesArray(pages, url) {
    const promises = [];
    const instance = axios.create({
      responseType: "stream",
    });

    console.log("generating rawmanga promises");

    for (let i = 1; i <= pages; i++) {
      promises.push(instance.get(`${url}/${i}`));
    }
    return promises;
  },
};
