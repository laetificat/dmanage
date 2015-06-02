/**
 * Get general data from Docker, for example: running
 * containers, total containers, and total base images.
 * Author: Kevin Heruer
 *
 * This is part of the DMANAGE source, you are free to
 * use, modify, and republish this code.
 */

/**
 * Require needed modules.
 */
var http = require('http');

/**
 * Get all the existing containers
 * TODO: Make this Unix socket compatible
 *
 * @type {{hostname: (XML|string|void), port: (new_config.docker_api_port|*), path: string, method: string, headers: {Content-Type: string}}}
 */
var total_containers_options = {
    hostname: config.default.docker_api_url.replace(/.*:\/\//i, ''),
    port: config.default.docker_api_port,
    path: '/containers/json?all=true',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

var total_containers_data = '';

/**
 * Send a request to get all the containers.
 */
var total_containers_req = http.request(total_containers_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        total_containers_data += chunk;
    });

    res.on('end', function() {
        var jsonobject = JSON.parse(total_containers_data);
        var div = document.getElementById('total-containers');
        var containers = 0;
        for (var i = 0; i < jsonobject.length; i++) {
            containers++;
        }
        div.innerHTML = "<h4>Total containers</h4><h1>" + containers.toString() + "</h1>";
    });
});

total_containers_req.on('error', function(error) {
    console.log("Error: " + error.message);
});

total_containers_req.end();


/**
 * Get all the running containers
 *
 * @type {{hostname: (XML|string|void), port: (new_config.docker_api_port|*), path: string, method: string, headers: {Content-Type: string}}}
 */
var running_containers_options = {
    hostname: config.default.docker_api_url.replace(/.*:\/\//i, ''),
    port: config.default.docker_api_port,
    path: '/containers/json',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

var running_containers_data = '';

/**
 * Send a request to get all the running containers.
 */
var running_containers_req = http.request(running_containers_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        running_containers_data += chunk;
    });

    res.on('end', function() {
        var jsonobject = JSON.parse(running_containers_data);
        var div = document.getElementById('running-containers');
        var running_containers = 0;
        for (var i = 0; i < jsonobject.length; i++) {
            running_containers++;
        }
        div.innerHTML = "<h4>Total running containers</h4><h1>" + running_containers.toString() + "</h1>";
    });
});

running_containers_req.on('error', function(error) {
    console.log("Error: " + error.message);
});

running_containers_req.end();


/**
 * Get all existing base images
 *
 * @type {{hostname: (XML|string|void), port: (new_config.docker_api_port|*), path: string, method: string, headers: {Content-Type: string}}}
 */
var total_images_options = {
    hostname: config.default.docker_api_url.replace(/.*:\/\//i, ''),
    port: config.default.docker_api_port,
    path: '/images/json',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

var total_images_data = '';

/**
 * Send a request to get all the base images.
 */
var total_images_req = http.request(total_images_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        total_images_data += chunk;
    });

    res.on('end', function() {
        var jsonobject = JSON.parse(total_images_data);
        var div = document.getElementById('total-images');
        var total_images = 0;
        for (var i = 0; i < jsonobject.length; i++) {
            total_images++;
        }
        div.innerHTML = "<h4>Total base images</h4><h1>" + total_images.toString() + "</h1>";
    });
});

total_images_req.on('error', function(error) {
    console.log("Error: " + error.message);
});

total_images_req.end();