/**
 * Build images from a Dockerfile
 * Author: Kevin Heruer
 *
 * This is part of the DMANAGE source, you are free to
 * use, modify, and republish this code.
 */

/**
 * Require the needed modules and files.
 */
var http = require('http');
var tar = require('tar-fs');
var fs = require('fs');
var request = require('request');

/**
 * Listen for a click even on the build button.
 */
$(document).on("click", "#build-image-now", function () {

    /**
     * Hide the button as soon it's clicked to prevent
     * creating multiple base images at the same time.
     */
    $(this).hide();

    /**
     * Grab the values from the file select field and
     * the image tag text field, also create a file
     * path where the dockerfile is right now.
     *
     * TODO: Change dockerfilepath to system temp folder.
     *
     * @type {*|jQuery}
     */
    var dockerfile = $("#dockerFileSelect").val();
    var imageTag = "t=" + $("#image-tag").val();
    var dockerfilepath = dockerfile.replace('Dockerfile', '');

    /**
     * Check if all the fields are filled.
     *
     * TODO: Create a popup for the end user.
     */
    if (!dockerfile || !imageTag) {
        $("#build-image-now").show();
        return console.log("Fill in all fields");
    }

    /**
     * Archive the Dockerfile in a tar archive, then send it
     * to docker's build REST API with an image tag and the
     * tar itself.
     *
     * TODO: Make the entries option configurable.
     */
    var tarFile = tar.pack(dockerfilepath, {
        entries: ['Dockerfile']
    }).pipe(fs.createWriteStream(dockerfile + '.tar'));

    tarFile.on('finish', function() {
        var req = request.post(config.default.docker_api_url + ':' + config.default.docker_api_port + '/build?' + imageTag, function (err, res, body) {
            if (err) {
                //TODO: Log error
                console.log(err);
                $("#build-image-now").show();
            } else {
                //TODO: Return a success message
                $("#build-image-now").show();
            }
        });

        /**
         * Upload the tar archive containing the docker configuratio
         * file, after upload delete the local tar archive.
         *
         * TODO: The temporary tar archive should be placed in OS temp folder
         */
        var uploadTar = fs.createReadStream(dockerfile + ".tar").pipe(req);
        uploadTar.on('end', function() {
            fs.unlink(dockerfile + ".tar");
        });

        var logUI = document.getElementById('logTextarea');
        uploadTar.on('data', function(chunk) {
            var returnedChunk = JSON.parse(chunk);
            logUI.innerHTML += returnedChunk.stream + '<br>';
        });
    });

});