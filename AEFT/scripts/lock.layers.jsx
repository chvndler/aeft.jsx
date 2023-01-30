/**
 * @title Lock All Layers
 * @version 1.0
 * @author Chandler Chappell <@chvndler>
 *
 * @description Lock all layers.
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 *
 */

(function () {
  function lockAllLayers(comp) {
    var layers = comp.layers;
    var numLayers = layers.length;
    for (var l = 1; l <= numLayers; l++) {
      var layer = layers[l];
      layer.locked = true;
    }
  }

  app.beginUndoGroup("Lock Layer(s)");
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
