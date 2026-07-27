// Source Text expression:
// Reveals characters over time using a slider.
var charsPerSecond = effect("Chars Per Second")("Slider");
var count = Math.max(0, Math.floor(time * charsPerSecond));
value.substr(0, count);
