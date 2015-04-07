var http = require('http');
var zlib = require('zlib');
var fs = require('fs');

$(document).on("click", "#build-image-now", function () {

    var dockerfile = $("#dockerfile-path").val();
    var imageTag = $("#image-tag").val();

    if (!dockerfile || !imageTag) {
        return console.log("Fill in all fields");
    }

    var gzip = zlib.createGzip();
    var inp = fs.createReadStream(dockerfile);
    var out = fs.createWriteStream(dockerfile + ".tar.gz");

    inp.pipe(gzip).pipe(out);

    console.log(dockerfile);
    console.log(imageTag);

    var options = {
        hostname: '127.0.0.1',
        port: 4243,
        path: '/build',
        method: 'POST',
        headers: { 'Content-Type': 'application/tar' }
    };

    var request = http.request(options, function(res) {
        console.log(res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            dockerdata += chunk;
        });

        res.on('end', function() {
            fs.unlink(dockerfile + "tar.gz", function(err) {
                if (err) {
                    throw err;
                }

                console.log("Successfully deleted " + dockerfile + ".tar.gz");
            })
        });
    });

    request.on('error', function(error) {
        console.log("Error: " + error.message);
    });

    request.end();

});