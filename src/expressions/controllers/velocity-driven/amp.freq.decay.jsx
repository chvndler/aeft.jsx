CTRL = thisComp.layer('VELOCITY_CTRL');

// VELOCITY-DRIVEN DECAY WOBBLE
// Apply to any keyframed property (Position, Scale, Rotation)
//
// How it works:
// After each keyframe, the property inherits its exit velocity,
// then oscillates and settles using a decaying sine wave.
//
// ------------------------------------------------------------
// CONTROLS (VELOCITY_CTRL layer)
// ------------------------------------------------------------
//
// Amp (Amplitude)
// • Scales how far the wobble travels
// • Multiplies the keyframe’s exit velocity
// • Higher = bigger overshoot
// • Typical range: 0.03 – 0.25
//
// Freq (Frequency, Hz)
// • Oscillations per second
// • Higher = faster, tighter vibration
// • Lower = slower, floatier motion
// • Typical range: 1 – 10
//
// Decay (Damping strength)
// • Controls how fast the wobble fades out
// • Higher = settles faster
// • Lower = longer, looser motion
// • Typical range: 2 – 15
//
// Time Max (Seconds)
// • Hard cutoff for the wobble after a keyframe
// • Once exceeded, motion returns to pure keyframes
// • Useful for art direction + performance
// • Typical range: 0.5 – 4
// ------------------------------------------------------------

// slider fetch with defaults
function ctrl(name, def) {
  try {
    CTRL.effect(name)('Slider').value;
  } catch (e) {
    def;
  }
}

// default values (used if sliders don’t exist)
amp = ctrl('amp', 0.08);
freq = ctrl('freq', 2.0);
decay = ctrl('decay', 5.0);
time_max = ctrl('time_max', 2.0);

// ------------------------------------------------------------
// most recent keyframe
// ------------------------------------------------------------
n = 0;
if (numKeys > 0) {
  n = nearestKey(time).index;
  if (key(n).time > time) n--;
}

// time since last keyframe
t = n == 0 ? 0 : time - key(n).time;

// ------------------------------------------------------------
// apply decaying oscillation
// ------------------------------------------------------------
if (n > 0 && t < time_max) {
  // sample velocity just before the keyframe
  v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);

  // decaying sine-wave wobble
  value + (v * amp * Math.sin(freq * t * 2 * Math.PI)) / Math.exp(decay * t);
} else {
  value;
}
