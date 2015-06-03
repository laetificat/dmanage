/**
 * Load, edit, and save settings. Currently the settings
 * are saved in src/config/config.json in plain text.
 * Author: Kevin Heruer
 *
 * This is part of the DMANAGE source, you are free to
 * use, modify, and republish this code.
 */

/**
 * Require the filesystem module to write and watch the config file
 */
var fs = require('fs');

/**
 * The config file and environment
 */
var configuration_file = 'src/config/config.json';
var configuration_type = 'default';

/**
 * Get all the needed elements from the page
 * @type {HTMLElement}
 */
var docker_api_url_textfield = document.getElementById("docker-url");
var docker_api_port_textfield = document.getElementById("docker-port");
var docker_hub_username_textfield = document.getElementById("hub-username");
var docker_hub_password_textfield = document.getElementById("hub-password");
var docker_http_settings = document.getElementById("docker-http-settings");
var docker_unix_settings = document.getElementById("docker-unix-settings");
var docker_api_unix_textfield = document.getElementById("docker-unix");

function loadConfig(config_file, config_type) {
    /**
     * Load configuration file
     * @type {Object}
     */
    fs.readFile(config_file, 'utf-8', function(err, content) {
        if (err) {
            fs.appendFile('src/log/error.log', err + '\n');
        }

        var config = null;
        config = JSON.parse(content);

        /**
         * Get current connection type
         */
        var connection_type = config[config_type].docker_connection_type;

        /**
         * Set Docker API URL and port
         * @type {HTMLElement}
         */
        if (connection_type == 'http') {
            docker_http_settings.removeAttribute("hidden");
            docker_unix_settings.setAttribute("hidden", null);
            docker_api_url_textfield.value = config[config_type].docker_api_url;
            docker_api_port_textfield.value = config[config_type].docker_api_port;
        }

        /**
         * Set Docker Unix socket location
         */
        if (connection_type == 'unix') {
            docker_unix_settings.removeAttribute("hidden");
            docker_http_settings.setAttribute("hidden", null);
            docker_api_unix_textfield.value = config[config_type].docker_api_unix;
        }

        /**
         * Set Dockerhub username
         * @type {HTMLElement}
         */
        docker_hub_username_textfield.value = config[config_type].docker_hub_username;

        /**
         * Set Dockerhub password
         * @type {HTMLElement}
         */
        docker_hub_password_textfield.value = config[config_type].docker_hub_password;


        /**
         * Set Docker connection method
         */
        var docker_connection_type_radioButton = document.getElementById("connection-" + connection_type.toLowerCase());
        docker_connection_type_radioButton.checked = true;
    });

}

/**
 * Load the config file which can contain multiple configuration
 * collections like 'dev', 'prod', or 'default'.
 */
loadConfig(configuration_file, configuration_type);

function saveConfig(config_type) {
    var new_config = {};
    new_config[config_type] = {};

    new_config[config_type].docker_hub_username = docker_hub_username_textfield.value;
    new_config[config_type].docker_hub_password = docker_hub_password_textfield.value;

    if (document.getElementById("connection-http").checked == true) {
        new_config[config_type].docker_api_url = docker_api_url_textfield.value;
        new_config[config_type].docker_api_port = docker_api_port_textfield.value;
        new_config[config_type].docker_connection_type = "http";
    }

    if (document.getElementById("connection-unix").checked == true) {
        new_config[config_type].docker_api_unix = docker_api_unix_textfield.value;
        new_config[config_type].docker_connection_type = "unix"
    }

    var config_as_string = JSON.stringify(new_config, null, 2);

    fs.writeFile(configuration_file, config_as_string, function(err) {
        if (err) {
            document.getElementById("notification-fail").removeAttribute("hidden");
            fs.appendFile('src/log/error.log', err + '\n');
        } else {
            document.getElementById("notification-success").removeAttribute("hidden");
        }
    });
}

$(document).on('click', '#save-configuration', function() {
    saveConfig('default');
    loadConfig(configuration_file, configuration_type);
});
