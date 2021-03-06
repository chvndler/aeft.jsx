/**
 *
 * @description Add a text style.
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 *
 */

function createTextlayer() {
  app.beginUndoGroup('create-text-layer');
  var comp = app.project.activeItem;
  if (comp != null) {
    if (comp instanceof CompItem) {
      layers = comp.layers;
      sel_layer = comp.selectedLayers.pop();
    }
  } else {
    return write('No Comp selected.');
  }

  layer = layers.addText();
  if (sel_layer) {
    oText.moveBefore(sel_layer);
  }

  //Set Text Properties
  var layer_prop = layer.property('ADBE Text Properties').property('ADBE Text Document');
  var layer_doc = layer_prop.value;
  layer_doc.text = 'LirumLarum';
  layer_doc.applyFill = true;
  layer_doc.fillColor = [1, 1, 1];
  layer_doc.justification = ParagraphJustification.CENTER_JUSTIFY;
  layer_prop.setValue(layer_doc);

  //Add Effects
  //FastBlur
  effect1 = layer.property('ADBE Effect Parade').addProperty('ADBE Fast Blur');
  shift = layer
    .property('ADBE Effect Parade')
    .property('ADBE Fast Blur')
    .property('ADBE Fast Blur-0001')
    .setValue(10);

  //Shift Channels
  effect2 = layer.property('ADBE Effect Parade').addProperty('ADBE Shift Channels');
  shift = layer
    .property('ADBE Effect Parade')
    .property('ADBE Shift Channels')
    .property('ADBE Shift Channels-0001')
    .setValue(9);

  //Fill
  effect3 = layer.property('ADBE Effect Parade').addProperty('ADBE Fill');
  shift = layer
    .property('ADBE Effect Parade')
    .property('ADBE Fill')
    .property('ADBE Fill-0002')
    .setValue([0, 0, 0]);

  //CC Composite
  effect4 = layer.property('ADBE Effect Parade').addProperty('CC Composite');

  app.endUndoGroup();
}

createTextlayer();
