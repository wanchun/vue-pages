var path = require("path");
var fs = require("fs");
var projectDir = path.resolve(__dirname, "./src");

var pageDirNames = fs.readdirSync(path.resolve(projectDir, "./views/"));

module.exports = {
    getPages : function () {
        return pageDirNames
    }
};
