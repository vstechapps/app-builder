var fs = require('fs');

if(fs.existsSync("src")){
    console.error("init error : \"src\" folder already exists");
}
else{
    initialize();
}

function initialize(){
    var components=["admin","main",""];
    var files=["index.html","script.js","style.css"]
    components.forEach(component=>{
        fs.mkdirSync("src/"+component,{recursive: true});
        files.forEach(file=>{
            var path="src/"+component+"/"+file;
            fs.writeFile(path, component+" "+file, function (err) {
                if (err) throw err;
                console.log('Created file : '+path);
            });
        });
    });
}