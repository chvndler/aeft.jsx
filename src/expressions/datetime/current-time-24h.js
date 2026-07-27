// Render current time as: 12:00.
var now = new Date();
now.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: false,
});
