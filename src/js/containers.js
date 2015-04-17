var http = require('http');

var options = {
    hostname: '127.0.0.1',
    port: 4243,
    path: '/containers/json?all=1',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

var dockerdata = '';

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

$(document).on("click", "a.delete", function () {
    var containerId = $(this).attr("data-id").toLowerCase();

    var delete_options = {
        hostname: '127.0.0.1',
        port: 4243,
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

$(document).on("click", "a.startStop", function () {
    var containerId = $(this).attr("data-id").toLowerCase();
    var action = $(this).attr("data-action").toLowerCase();

    console.log(action);
    console.log(containerId);

    var startStop_options = {
        hostname: '127.0.0.1',
        port: 4243,
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