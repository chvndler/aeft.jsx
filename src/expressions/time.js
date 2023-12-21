// Render the current time, formatted → 12:00 PM
d = new Date();
currentTime = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
currentTime;

// Render the current time, formatted → 12:00:00 PM
d = new Date();
currentTime = d.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
});
currentTime;

// Render the current time, formatted → 12:00
d = new Date();
currentTime = d.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
});
currentTime;

// Render the current time, formatted → X:00
d = new Date();
hours = d.getHours();
minutes = d.getMinutes();

if (hours > 12) {
  hours -= 12;
} else if (hours === 0) {
  hours = 12;
}

currentTime = hours + ':' + minutes;
currentTime;
