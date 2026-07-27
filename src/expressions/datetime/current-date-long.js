// Render current date as: Thursday, December 21.
var now = new Date();
now.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});
