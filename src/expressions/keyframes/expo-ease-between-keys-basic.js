/**
 * Exponential ease between surrounding keyframes.
 * Works on 1D/2D/3D properties.
 */

function keyflowInOut(t, b, c, d) {
  var correction = 0.000976563;
  var eased;

  if ((t /= d / 2) < 1) {
    eased = Math.pow(2, 10 * (t - 1)) - correction;
  } else {
    eased = -Math.pow(2, -10 * (t - 1)) + 2 + correction;
  }

  return b + (eased / 2) * c;
}

function keyEase() {
  var n = 0;
  if (numKeys > 0) {
    n = nearestKey(time).index;
    if (key(n).time > time) {
      n--;
    }
  }

  var key1;
  var key2;
  try {
    key1 = key(n);
    key2 = key(n + 1);
  } catch (e) {
    return null;
  }

  var dim = 1;
  try {
    key(1)[1];
    dim = 2;
    key(1)[2];
    dim = 3;
  } catch (e2) {}

  var localT = time - key1.time;
  var duration = key2.time - key1.time;

  var startX = key1[0];
  var changeX = key2[0] - key1[0];

  var startY;
  var changeY;
  var startZ;
  var changeZ;

  if (dim >= 2) {
    startY = key1[1];
    changeY = key2[1] - key1[1];

    if (dim >= 3) {
      startZ = key1[2];
      changeZ = key2[2] - key1[2];
    }
  }

  if (time < key1.time || time > key2.time) {
    return value;
  }

  var value1 = keyflowInOut(localT, startX, changeX, duration);
  if (dim === 1) {
    return value1;
  }

  var value2 = keyflowInOut(localT, startY, changeY, duration);
  if (dim === 2) {
    return [value1, value2];
  }

  var value3 = keyflowInOut(localT, startZ, changeZ, duration);
  return [value1, value2, value3];
}

keyEase() || value;
