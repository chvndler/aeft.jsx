// X Position expression:
// Equal gaps using the right edge of the previous text layer.
// Requires a "Spacing" slider on layer "MENU_CTRL".
// Assumes the row starts at layer 1 and text layers are consecutive.

var gap = thisComp.layer("MENU_CTRL").effect("Spacing")("Slider");
var first = thisComp.layer(1);

function widthScaled(layer) {
  var rect = layer.sourceRectAtTime(time, false);
  return rect.width * (layer.transform.scale[0] / 100);
}

function centerOffset(layer) {
  var rect = layer.sourceRectAtTime(time, false);
  return (-rect.left + rect.width / 2) * (layer.transform.scale[0] / 100);
}

function rightOffset(layer) {
  var rect = layer.sourceRectAtTime(time, false);
  return (-rect.left + rect.width) * (layer.transform.scale[0] / 100);
}

var firstLeft = first.transform.xPosition - centerOffset(first);
var firstRight = first.transform.xPosition + rightOffset(first);

if (index === first.index) {
  firstLeft + centerOffset(thisLayer);
} else {
  var totalPrev = 0;
  for (var i = first.index + 1; i < index; i++) {
    totalPrev += widthScaled(thisComp.layer(i));
  }

  var left = firstRight + totalPrev + (index - first.index) * gap;
  left + centerOffset(thisLayer);
}
