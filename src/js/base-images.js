var http = require('http');
var request = require('request');

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
            var items = "<th>Docker options</th><th>Tags</th><th>Extra options</th><th></th>";
            for (var i = 0; i < jsonobject.length; i++) {
                items = items + "<tr id=\"" + jsonobject[i].Id + "\"><td><input type=\"text\"/></td><td>" + jsonobject[i].RepoTags + "</td><td><input type=\"text\"/></td></td><td><a href=\"#\" class=\"delete\" data-imageId=\"" + jsonobject[i].Id + "\" data-imageName=\"" + jsonobject[i].RepoTags + "\"><span class=\"glyphicon glyphicon-trash\"></span></a> <a href=\"#\" class=\"run\" data-imageId=\"" + jsonobject[i].Id + "\" data-imageName=\"" + jsonobject[i].RepoTags + "\"><span class=\"glyphicon glyphicon-play\"></span></a></td></tr>";
            }
            div.innerHTML = "<table class=\"table table-striped\">" + items + "</table>";
        }
    });
});

base_images_req.on('error', function(error) {
    console.log("Error: " + error.message);
});

base_images_req.end();

$(document).on("click", "a.run", function() {
    var imageName = $(this).attr("data-imageName");
    var imageId = $(this).attr("data-imageId");

    var postBody = {
        "Image": imageName
    };

    request.post({uri:'http://127.0.0.1:4243/containers/create', json: postBody}, function(err, res, body) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
            console.log(body);
        }
    });
});

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