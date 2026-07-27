// Vertical rolling counter driven by slider delta per frame.
var slider = effect("Number")("Slider");
var current = slider.value;
var previous = slider.valueAtTime(time - thisComp.frameDuration);
var offset =
  (previous - current) *
  (thisComp.height * 0.5 - ((time * 10000) % thisComp.height));

[0, offset];
