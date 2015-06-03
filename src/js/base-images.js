/**
 * List, run, delete Docker base images.
 * Author: Kevin Heruer
 *
 * This is part of the DMANAGE source, you are free to
 * use, modify, and republish this code.
 */

/**
 * Require the needed modules.
 */
var http = require('http');
var request = require('request');

/**
 * Set some base options to connect to the Docker API
 * @type {{hostname: string, port: number, path: string, method: string, headers: {Content-Type: string}}}
 */
var base_images_options = {
    hostname: config.default.docker_api_url.replace(/.*:\/\//i, ''),
    port: config.default.docker_api_port,
    path: '/images/json',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

/**
 * Data returned from the Docker API stream.
 * @type {string}
 */
var base_images_dockerdata = '';

/**
 * Fetch all the base images and list them by tag.
 */
var base_images_req = http.request(base_images_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        base_images_dockerdata += chunk;
    });

    /**
     * If all the data is collected and the stream is closed,
     * loop through the JSON data and add a row for every tag
     * found in every base image and apply some buttons to it.
     */
    res.on('end', function() {
        var jsonobject = JSON.parse(base_images_dockerdata);
        var div = document.getElementById('docker-images');
        if (jsonobject.length == 0) {
            div.innerHTML = "<h1>No base images found</h1>";
        } else {
            var items = "<th>Tags</th><th></th>";
            for (var i = 0; i < jsonobject.length; i++) {
                for (var x = 0; x < jsonobject[i].RepoTags.length; x++) {
                    items = items + "<tr id=\"" + jsonobject[i].RepoTags[x] + "\"><td>" + jsonobject[i].RepoTags[x] + "</td></td><td><a href=\"#\" class=\"delete\" data-imageId=\"" + jsonobject[i].Id + "\" data-imageName=\"" + jsonobject[i].RepoTags[x] + "\"><span class=\"glyphicon glyphicon-trash\"></span></a> <a href=\"#\" class=\"run\" data-imageId=\"" + jsonobject[i].Id + "\" data-imageName=\"" + jsonobject[i].RepoTags[x] + "\"><span class=\"glyphicon glyphicon-play\"></span></a></td></tr>";
                }
            }
            div.innerHTML = "<table class=\"table table-striped\">" + items + "</table>";
        }
    });
});

/**
 * If there is an error, log it.
 * TODO: Log errors to error.log and not the console.
 */
base_images_req.on('error', function(error) {
    console.log("Error: " + error.message);
});

/**
 * End the stream.
 */
base_images_req.end();

/**
 * If clicked on the run button, make a call to the Docker API and
 * use the variables found in the HTML.
 */
$(document).on("click", "a.run", function() {
    var imageName = $(this).attr("data-imageName");
    var imageId = $(this).attr("data-imageId");

    var postBody = {
        "Image": imageName
    };

    /**
     * TODO: Write to error.log
     */
    request.post({uri:config.default.docker_api_url + ':' + config.default.docker_api_port + '/containers/create', json: postBody}, function(err, res, body) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
            console.log(body);
        }
    });
});

/**
 * If clicked on the delete button, call the Docker API with
 * DELETE and the corresponding data from the HTML DOM.
 */
$(document).on("click", "a.delete", function() {
    var imageName = $(this).attr("data-imageName");
    var imageId = $(this).attr("data-imageId");

    /**
     * TODO: Ask user for confirmation and, if possible, only do it when docker needs to force
     * @type {{hostname: (XML|string|void), port: (new_config.docker_api_port|*), path: string, method: string, headers: {Content-Type: string}}}
     */
    var delete_base_images_options = {
        hostname: config.default.docker_api_url.replace(/.*:\/\//i, ''),
        port: config.default.docker_api_port,
        path: '/images/' + imageName + '?force=1',
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
            console.log(escapeId(imageName));
            $("#" + escapeId(imageName)).remove();
            console.log(delete_base_images_dockerdata);
        });
    });

    delete_base_images_req.on('error', function(error) {
        console.log("Error: " + error.message);
    });

    delete_base_images_req.end();
});

/**
 * Escape characters from a string because jQuery has problems
 * with selecting id's from the DOM if it contains certain
 * characters.
 * @param div_id
 * @returns {XML|string|void}
 */
function escapeId(div_id) {
    return div_id.replace(/(:|\.|\/|\[|\]|<|>)/g, "\\$1");
}