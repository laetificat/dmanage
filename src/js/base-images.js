var http = require('http');

var base_images_options = {
    hostname: '127.0.0.1',
    port: 4243,
    path: '/images/json',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

var base_images_dockerdata = '';

var base_images_req = http.request(base_images_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        base_images_dockerdata += chunk;
    });

    res.on('end', function() {
        var jsonobject = JSON.parse(base_images_dockerdata);
        var div = document.getElementById('docker-images');
        if (jsonobject.length == 0) {
            div.innerHTML = "<h1>No base images found</h1>";
        } else {
            var items = "";
            for (var i = 0; i < jsonobject.length; i++) {
                items = items + "<tr id=\"" + jsonobject[i].Id + "\"><td>" + jsonobject[i].RepoTags + "</td><td><a href=\"#\" class=\"delete\" data-imageId=\"" + jsonobject[i].Id + "\" data-imageName=\"" + jsonobject[i].RepoTags + "\"><span class=\"glyphicon glyphicon-trash\"></span></a></td></tr>";
            }
            div.innerHTML = "<table class=\"table table-striped\">" + items + "</table>";
        }
    });
});

base_images_req.on('error', function(error) {
    console.log("Error: " + error.message);
});

base_images_req.end();

$(document).on("click", "a.delete", function() {
    var imageName = $(this).attr("data-imageName");
    var imageId = $(this).attr("data-imageId");

    var delete_base_images_options = {
        hostname: '127.0.0.1',
        port: 4243,
        path: '/images/' + imageName,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    };

    var delete_base_images_dockerdata = '';

    var delete_base_images_req = http.request(delete_base_images_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            delete_base_images_dockerdata += chunk;
        });

        res.on('end', function() {
            $("#" + imageId).remove();
        });
    });

    delete_base_images_req.on('error', function(error) {
        console.log("Error: " + error.message);
    });

    delete_base_images_req.end();
});