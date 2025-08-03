(function() {
    function lockAllLayers(comp) {
        var layers = comp.layers;
        var numLayers = layers.length;
        for (var l = 1; l <= numLayers; l++) {
            var layer = layers[l];
            // Optional: Check if the layer is already locked
            if (!layer.locked) {
                layer.locked = true;
            }
        }
    }

    app.beginUndoGroup('Lock Layer(s)');
    var project = app.project;
    var items = project.items;
    var numItems = items.length;
    for (var i = 1; i <= numItems; i++) {
        var item = items[i];
        if (item instanceof CompItem) {
            lockAllLayers(item);
        }
    }
    app.endUndoGroup();
})();