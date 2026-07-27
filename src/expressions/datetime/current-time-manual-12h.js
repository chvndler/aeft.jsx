// Render current time manually as X:MM (12h clock, no AM/PM).
var now = new Date();
var hours = now.getHours();
var minutes = now.getMinutes();
var minutePadded = minutes < 10 ? "0" + minutes : "" + minutes;

if (hours > 12) {
  hours -= 12;
} else if (hours === 0) {
  hours = 12;
}

hours + ":" + minutePadded;
