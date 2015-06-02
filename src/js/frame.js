/**
 * The frame is the wrapper for everything, the configuration
 * is loaded here so it's available everywhere in the application.
 * Author: Kevin Heruer
 *
 * This is part of the DMANAGE source, you are free to
 * use, modify, and republish this code.
 */

/**
 * Load the required modules.
 * @type {exports}
 */
var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require('fs');
var config = null;

var readConfig = fs.readFileSync('src/config/config.json', 'utf-8', function(err, content) {
    if (err) {
        console.log(err);
    }

    return content;
});

config = JSON.parse(readConfig);

$("#window-button-close").on("click", function() {
    win.close();
});