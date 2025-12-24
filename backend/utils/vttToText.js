const fs = require("fs");

module.exports = function vttToText(vttPath) {
  const content = fs.readFileSync(vttPath, "utf-8");

  return content
    .replace(/WEBVTT/g, "")
    .replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> .*$/gm, "")
    .replace(/<[^>]*>/g, "") // html tags
    .replace(/\n+/g, " ")
    .trim();
};
