// X Position — equal gaps by using the *right edge* of previous text
// Needs "Spacing" Slider on layer "MENU_CTRL"
// Assumes the row starts at layer 1 and text layers are consecutive

var gap = thisComp.layer('MENU_CTRL').effect('Spacing')('Slider');
var first = thisComp.layer(1);

function w(L) {
  var r = L.sourceRectAtTime(time, false);
  return r.width * (L.transform.scale[0] / 100);
}
function centerOffset(L) {
  var r = L.sourceRectAtTime(time, false);
  return (-r.left + r.width / 2) * (L.transform.scale[0] / 100);
}
function rightOffset(L) {
  // distance from anchor to right edge
  var r = L.sourceRectAtTime(time, false);
  return (-r.left + r.width) * (L.transform.scale[0] / 100);
}

// first layer edges
var firstLeft = first.transform.xPosition - centerOffset(first);
var firstRight = first.transform.xPosition + rightOffset(first);

if (index == first.index) {
  firstLeft + centerOffset(thisLayer);
} else {
  var totalPrev = 0;
  for (var i = first.index + 1; i < index; i++) {
    totalPrev += w(thisComp.layer(i));
  }
  var left = firstRight + totalPrev + (index - first.index) * gap;
  left + centerOffset(thisLayer);
}
