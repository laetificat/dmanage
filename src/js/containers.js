/**
 * Get and list all the containers and show them in
 * a nice list complete with run, stop, and remove
 * buttons.
 * Author: Kevin Heruer
 *
 * This is part of the DMANAGE source, you are free to
 * use, modify, and republish this code.
 */

/**
 * Require all the needed modules.
 */
var http = require('http');

/**
 * Set up the options for the request that will be sent
 * later to receive all the containers and their information.
 * @type {{hostname: (XML|string|void), port: (new_config.docker_api_port|*), path: string, method: string, headers: {Content-Type: string}}}
 */
var options = {
    hostname: config.default.docker_api_url.replace(/.*:\/\//i, ''),
    port: config.default.docker_api_port,
    path: '/containers/json?all=1',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

var dockerdata = '';

/**
 * Send the request with the options object, if the
 * response is complete and it contains wanted data,
 * loop through them and list them with some HTML
 * to make it pretty.
 */
var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        dockerdata += chunk;
    });

    res.on('end', function() {
        var jsonobject = JSON.parse(dockerdata);
        var div = document.getElementById('docker-containers');
        if (jsonobject.length == 0) {
            div.innerHTML = "<h1>No containers found</h1>";
        } else {
            for (var i = 0; i < jsonobject.length; i++) {
                var status = null;
                var startStop = null;
                var deleteAction = null;
                if (jsonobject[i].Status.indexOf('Up') > -1) {
                    status = "Running";
                    startStop = "Stop";
                    deleteAction = "";
                } else {
                    status = "Stopped";
                    startStop = "Start";
                    deleteAction = "Delete";
                }
                div.innerHTML = div.innerHTML +
                "<div id=\"" + jsonobject[i].Id + "\" class=\"col-md-4\">\
                    <div class=\"container-info\">\
                        <span class=\"label label-danger container-status\">" + status + "</span>\
                        <p class=\"created-by\">" + jsonobject[i].Image + "</p>\
                        <h3 class=\"container-title\">" + jsonobject[i].Names[0] + "</h3>\
                        <p class=\"container-description\">\
                        Command: /bin/bash<br />\
                        Flags: -i, -t, --name, -d, -p<br />\
                        Port(s): 42235<br />\
                        <a href=\"#\">More info</a>\
                        </p>\
                        <div class=\"container-controls\">\
                            <a href=\"#\" data-id=\"" + jsonobject[i].Id + "\"class=\"delete\"><span class=\"glyphicon glyphicon-remove\"></span> " + deleteAction + "</a>\
                            <a href=\"#\" data-id=\"" + jsonobject[i].Id + "\"data-action=\"" + startStop + "\" class=\"startStop\"><span class=\"glyphicon glyphicon-play\"></span> Start</a>\
                        </div>\
                    </div>\
                </div>"
            }
        }
    });
});

req.on('error', function(error) {
    console.log("Error: " + error.message);
});

req.end();

/**
 * When the delete button is pressed, make a call to
 * the Docker API containing the container ID.
 */
$(document).on("click", "a.delete", function () {
    var containerId = $(this).attr("data-id").toLowerCase();

    var delete_options = {
        hostname: config.default.docker_api_url.replace(/.*:\/\//i, ''),
        port: config.default.docker_api_port,
        path: '/containers/' + containerId,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    };

    var delete_request = http.request(delete_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            dockerdata += chunk;
        });

        res.on('end', function() {
            $("#content").load("html/pages/containers.html");
        });
    });

    delete_request.on('error', function(error) {
        console.log("Error: " + error.message);
    });

    delete_request.end();
});

/**
 * When the start/stop button is pressed, send a call
 * to the Docker API containing the container ID.
 * The start and stop button are both handled in the
 * same listener.
 */
$(document).on("click", "a.startStop", function () {
    var containerId = $(this).attr("data-id").toLowerCase();
    var action = $(this).attr("data-action").toLowerCase();

    console.log(action);
    console.log(containerId);

    var startStop_options = {
        hostname: config.default.docker_api_url.replace(/.*:\/\//i, ''),
        port: config.default.docker_api_port,
        path: '/containers/' + containerId + '/' + action,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    // TODO: Loading indication
    var startStop_request = http.request(startStop_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            dockerdata += chunk;
        });

        res.on('end', function() {
            console.log(res.statusCode);
            $("#content").load("html/pages/containers.html");
        });
    });

    startStop_request.on('error', function(error) {
        console.log("Error: " + error.message);
    });

    startStop_request.end();
});