var gui = require('nw.gui');
var win = gui.Window.get();

$("#window-button-close").on("click", function() {
    win.close();
});