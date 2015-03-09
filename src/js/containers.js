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
                    status = "<span class=\"label label-success\">Running</span>";
                    startStop = "Stop";
                    deleteAction = "";
                } else {
                    status = "<span class=\"label label-danger\">Not running</span>";
                    startStop = "Start";
                    deleteAction = "Delete";
                }
                div.innerHTML = div.innerHTML +
                "<p id=\"" + jsonobject[i].Id + "_parent\"><a class=\"collapsable\" data-toggle=\"collapse\" href=\"#" + jsonobject[i].Id + "\" aria-expanded=\"false\" aria-controls=\"" + jsonobject[i].Id + "\"><b>" + jsonobject[i].Names[0] + "</b>" +
                "</a> " + status +
                "<div class=\"collapse\" id =\"" + jsonobject[i].Id + "\">" +
                "<a class=\"containerAction startStop\" data-action=\"" + startStop + "\" href=\"#\">" + startStop + "</a> <a class=\"containerAction delete\" href=\"#\">" + deleteAction + "</a><br/>" +
                "Image: " + jsonobject[i].Image +
                "</div>" +
                "</p>";
            }
        }
    });
});

req.on('error', function(error) {
    console.log("Error: " + error.message);
});

req.end();

$(document).on("click", "a.delete", function () {
    var containerId = $(this).parent().attr("id");

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
    var containerId = $(this).parent().attr("id");
    var action = $(this).attr("data-action").toLowerCase();

    var startStop_options = {
        hostname: '127.0.0.1',
        port: 4243,
        path: '/containers/' + containerId + '/' + action,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    // TODO: Loading indication
    var startStop_request = http.request(startStop_options, function(res) {
        console.log(res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            dockerdata += chunk;
        });

        res.on('end', function() {
            $("#content").load("html/pages/containers.html");
        });
    });

    startStop_request.on('error', function(error) {
        console.log("Error: " + error.message);
    });

    startStop_request.end();
});