var path = require("path");
var fs = require("fs");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var projectDir = path.resolve(__dirname, "./src");
var pageDirNames = fs.readdirSync(path.resolve(projectDir, "./views/"));

var webpackConfig = {
    entry: {
        common : path.resolve(projectDir, "./common.js")
    },
    output: {
        path: path.resolve(__dirname, "./dist"),     //打包后的文件存放的地方
        filename: "[name].[hash].js",               //打包后输出文件的文件名
        chunkFilename: "[name].[hash].js"            //打包后输出文件的文件名
    },
    plugins : [
        // 将公共模块提取，生成名为`vendors`的chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            chunks: pageDirNames,
            minChunks: pageDirNames.length // 提取所有entry共同依赖的模块
        }),
        // 将名字为'common'的entry依赖的所有资源，生成名为`common`的chunk
        new webpack.optimize.CommonsChunkPlugin('commons')
    ]
};

pageDirNames.forEach(function (name) {
    //配置entry
    webpackConfig.entry[name] = path.resolve(projectDir, "./views/" + name + "/index.js");
    var  config = require(path.resolve(projectDir, "./views/" + name + "/config.json"));
    // 生成出来的html文件名
    config.filename = name + '.html';
    //每个html的模版，这里多个页面使用同一个模版
    config.template = path.resolve(__dirname, "./tmpl.html");
    // 自动将引用插入html
    config.inject = true;
    // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    config.chunks = ['vendors', 'commons',  name];

    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin(config);
    webpackConfig.plugins.push(plugin);
});

module.exports = webpackConfig;
