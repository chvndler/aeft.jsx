// Forces a slider value to render with 3 leading zeroes.
var digits = effect("Slider Control")("Slider").value.toFixed(0);
(digits.length < 3 ? (digits.length < 2 ? "00" : "0") : "") + digits;
