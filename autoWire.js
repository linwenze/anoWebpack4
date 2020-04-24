var fs = require("fs");
var path = require('path');
//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.resolve('./src');
var pathList = "";
function stringReplaceAll(str, AFindText, ARepText){
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,"\\$1"),"ig");
    return str.replace(raRegExp,ARepText);
}
/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    var files = fs.readdirSync(filePath);
    for(var index in files) {
        var filename = files[index];
        var filedir = path.join(filePath,filename);
        var stats = fs.statSync(filedir);
        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        if(isFile){
            var source = fs.readFileSync(filedir).toString();
            if(source.indexOf("@autowire") > -1) {
                filedir = stringReplaceAll(filedir, "\\", "/");
                pathList += "require('"+ filedir +"');\n";
            }
        } else if(isDir){
             fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        } 
    }
    return pathList;
}

module.exports = {
    /*只遍历*/
    autoScan() {
        //调用文件遍历方法
        pathList = fileDisplay(filePath);    
        fs.writeFileSync("./src/common/lib/autoLoadPathMap.js", pathList);
    }
}