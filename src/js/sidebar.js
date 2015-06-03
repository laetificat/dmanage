/**
 * The sidebar will load the correct HTML file that's
 * linked with the button, if a new HTML file is loaded
 * the old one is unloaded so there will be no old data
 * left when returning to that view.
 * Author: Kevin Heruer
 *
 * This is part of the DMANAGE source, you are free to
 * use, modify, and republish this code.
 */

var change = function() {
    $("li").removeClass("active");
    $("#content").html("");
};

change();
$("#content").load("html/pages/dashboard.html");
$("#item-dashboard").addClass("active");

$("#item-dashboard").on("click", function () {
    change();
    $("#content").load("html/pages/dashboard.html");
    $(this).addClass("active");
});

$("#item-containers").on("click", function () {
    change();
    $("#content").load("html/pages/containers.html");
    $(this).addClass("active");
});

$("#item-base-images").on("click", function () {
    change();
    $("#content").load("html/pages/base-images.html");
    $(this).addClass("active");
});

$("#item-build-image").on("click", function () {
    change();
    $("#content").load("html/pages/build.html");
    $(this).addClass("active");
});

$("#item-docker-hub").on("click", function () {
    alert("Docker hub is not available yet.")
    //change();
    //$("#content").load("html/pages/docker-hub.html");
    //$(this).addClass("active");
});

$("#item-settings").on("click", function () {
    change();
    $("#content").load("html/pages/settings.html");
    $(this).addClass("active");
});
