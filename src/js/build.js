var http = require('http');
var zlib = require('zlib');
var fs = require('fs');
var request = require('request');

$(document).on("click", "#build-image-now", function () {

    $("#build-image-now").hide();

    var dockerfile = $("#dockerFileSelect").val();
    var imageTag = "t=" + $("#image-tag").val();

    if (!dockerfile || !imageTag) {
        return console.log("Fill in all fields");
    }

    // TODO: generate tarballs instead of gunzips
    //var gzip = zlib.createGzip();
    //var inp = fs.createReadStream(dockerfile, {autoClose: true});
    //var out = fs.createWriteStream(dockerfile + ".gz");
    //inp.pipe(gzip).pipe(out);

    var req = request.post('http://127.0.0.1:4243/build?' + imageTag, function (err, res, body) {
        if (err) {
            console.log(err);
            $("#build-image-now").show();
        } else {
            console.log(res);
            console.log(body);
            $("#build-image-now").show();
        }
    });

    fs.createReadStream(dockerfile + ".tar").pipe(req);

});