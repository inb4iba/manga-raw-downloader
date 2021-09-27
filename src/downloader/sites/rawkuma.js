const axios = require("axios");

module.exports = {
  async getPromisesArray(url) {
    const promises = [];
    const instance = axios.create({
      responseType: "stream",
    });

    try {
      const res = await axios.get(url);

      let imgsStr = res.data.match(new RegExp(/images.+\]\}/))[0];
      imgsStr = imgsStr.match(/\[.+\]/)[0];
      imgsStr = imgsStr
        .slice(1, -1)
        .replace(/\"/g, "")
        .replace(/\\\//g, "/")
        .replace(/ /g, "%20");

      const imgsLink = imgsStr.split(",");
      imgsLink.map((link) => promises.push(instance.get(link)));

      return promises;
    } catch (err) {
      console.log(err);
    }
  },
};
