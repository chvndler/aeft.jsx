var ctrlLayer = thisComp.layer("VELOCITY_CTRL");

// VELOCITY-DRIVEN DECAY WOBBLE
// Apply to any keyframed property (Position, Scale, Rotation).
//
// Controls on VELOCITY_CTRL (slider names):
// - amp
// - freq
// - decay
// - time_max

function ctrl(name, fallback) {
  try {
    return ctrlLayer.effect(name)("Slider").value;
  } catch (e) {
    return fallback;
  }
}

var amp = ctrl("amp", 0.08);
var freq = ctrl("freq", 2.0);
var decay = ctrl("decay", 5.0);
var timeMax = ctrl("time_max", 2.0);

var n = 0;
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
