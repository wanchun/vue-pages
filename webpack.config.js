var path = require("path");
var fs = require("fs");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var util = require("./util");
var projectDir = path.resolve(__dirname, "./src");

var webpackConfig = {
    entry: {
        common : path.resolve(projectDir, "./common.js")
    },
    output: {
        path: path.resolve(__dirname, "./dist"),//打包后的文件存放的地方
        filename: "[name].[hash].js"//打包后输出文件的文件名
    },
    plugins : [
        new webpack.optimize.CommonsChunkPlugin('common', 'common.[hash].js')
    ]
};

util.getPages().forEach(function (name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = path.resolve(projectDir, "./views/" + name + "/index.js");
    var  config = require(path.resolve(projectDir, "./views/" + name + "/config.json"));

    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        title: config.title || "",
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: path.resolve(__dirname, "./tmpl.html"),
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: ['common', name]
    });
    webpackConfig.plugins.push(plugin);
});

module.exports = webpackConfig;