// Velocity-driven damped oscillation after each keyframe.
var amp = 0.08;
var freq = 2.0;
var decay = 5.0;
var n = 0;
var timeMax = 4;

if (numKeys > 0) {
  n = nearestKey(time).index;
  if (key(n).time > time) {
    n--;
  }
}

var elapsed = n === 0 ? 0 : time - key(n).time;

if (n > 0 && elapsed < timeMax) {
  var velocity = velocityAtTime(key(n).time - thisComp.frameDuration / 10);
  value +
    (velocity * amp * Math.sin(freq * elapsed * 2 * Math.PI)) /
      Math.exp(decay * elapsed);
} else {
  value;
}
