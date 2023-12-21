// Render the current date, formatted → DD/MM/YYYY
d = new Date();
currentDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
currentDate;

// Render the current date, formatted → Thursday, December 21
d = new Date();
currentDate = d.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});
currentDate;
