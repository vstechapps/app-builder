var fs = require('fs');
var _r = { recursive: true };

dobuild();

// Build code
function dobuild() {
    try {
        // Deleting docs folder
        console.log("Deleting docs folder");
        fs.rmdirSync("docs", _r);
        build("src");
        console.log("Build Successfull.")
    } catch (err) {
        console.error("Failed to build..");
        console.error(err);
    }

}

function build(dir) {
    fs.readdirSync(dir).forEach(function (file, index) {
        var path = dir + "/" + file;
        var stat = fs.statSync(path);
        if (stat.isDirectory()) {
            tpath = path.replace("src", "docs");
            fs.mkdirSync(tpath, _r);
            build(path);
        } else if (stat.isFile()) {
            console.log("Compiling file : " + path);
            var content = fs.readFileSync(path);
            path = path.replace("src", "docs");
            fs.writeFileSync(path, content);
        } else {
            console.log("Unable to compile file : " + path);
        }
    });
}