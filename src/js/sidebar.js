var change = function() {
    $("li").removeClass("active");
};

change();
$("#content").load("html/pages/dashboard.html");
$("#item-dashboard").addClass("active");

$("#item-dashboard").on("click", function () {
    $("#content").load("html/pages/dashboard.html");
    change();
    $(this).addClass("active");
});

$("#item-containers").on("click", function () {
    $("#content").load("html/pages/containers.html");
    change();
    $(this).addClass("active");
});

$("#item-base-images").on("click", function () {
    $("#content").load("html/pages/base-images.html");
    change();
    $(this).addClass("active");
});

$("#item-build-image").on("click", function () {
    $("#content").load("html/pages/build.html");
    change();
    $(this).addClass("active");
});

$("#item-docker-hub").on("click", function () {
    $("#content").load("html/pages/docker-hub.html");
    change();
    $(this).addClass("active");
});

$("#item-settings").on("click", function () {
    $("#content").load("html/pages/settings.html");
    change();
    $(this).addClass("active");
});
