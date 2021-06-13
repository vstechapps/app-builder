var http = require('http');
var fs = require('fs');
var _r = { recursive: true };
var watchFiles = [];
var port = 8080;


// Compiling all files inside src folder
docompile();

// Watching all files and dir for recompiling
watchFiles.forEach(path => {
    fs.watch(path, (event, file) => {
        console.log("Recompiling as " + file + " " + event);
        docompile();
    });
});

// Serving the content from target folder
console.log("Server serving at port : " + port);
http.createServer(function (req, res) {
    if (req.url == "") req.url = "index.html";
    var path = "target/" + req.url;
    if (fs.existsSync(path)) {
        res.write(fs.readFileSync(path));
        res.writeHead(200);
    }
    else res.writeHead(404);
    res.end();
}).listen(port);

// Compilation code
function docompile() {
    try {
        // Deleting target folder
        console.log("Deleting target folder");
        fs.rmdirSync("target", _r);
        compile("src");
        console.log("Compiled Successfully.")
    } catch (err) {
        console.error("Failed to compile..");
        console.error(err);
    }

}

function compile(dir) {
    fs.readdirSync(dir).forEach(function (file, index) {
        var path = dir + "/" + file;
        watchFiles.push(path);
        var stat = fs.statSync(path);
        if (stat.isDirectory()) {
            tpath = path.replace("src", "target");
            fs.mkdirSync(tpath, _r);
            compile(path);
        } else if (stat.isFile()) {
            console.log("Compiling file : " + path);
            var content = fs.readFileSync(path);
            path = path.replace("src", "target");
            fs.writeFileSync(path, content);
        } else {
            console.log("Unable to compile file : " + path);
        }
    });
}