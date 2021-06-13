var http = require('http');
var fs=require('fs');
var _r={recursive:true};

// Deleting target folder
console.log("Deleting target folder");
fs.rmdirSync("target",_r)
// Compiling all files inside src folder
compile("src");

function compile(dir){
    fs.readdirSync(dir).forEach(function (file, index) {
    var path=dir+"/"+file;
    var stat=fs.statSync(path);
      if(stat.isDirectory()){
          tpath=path.replace("src","target");
          fs.mkdirSync(tpath,_r);
          compile(path);
      }else if(stat.isFile()){
          console.log("Compiling file : "+path);
          var content=fs.readFileSync(path);
          path=path.replace("src","target");
          fs.writeFileSync(path, content);
      }else{
          console.log("Unable to compile file : "+path);
      }
});
}