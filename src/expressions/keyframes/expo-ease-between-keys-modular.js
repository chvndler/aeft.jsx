/**
 * Exponential ease between surrounding keyframes.
 * Modular variant with dedicated helper functions.
 */

function easeInOutExpo(t, b, c, d) {
  var correction = 1 / 1024;
  var eased;

  if (d === 0) {
    return b;
  }

  t /= d / 2;
  if (t < 1) {
    eased = Math.pow(2, 10 * (t - 1)) - correction;
  } else {
    eased = -Math.pow(2, -10 * (t - 1)) + 2 + correction;
  }

  return b + eased * 0.5 * c;
}

function getDimFromKey(prop) {
  try {
    prop.key(1)[2];
    return 3;
  } catch (e3) {
    try {
      prop.key(1)[1];
      return 2;
    } catch (e2) {
      return 1;
    }
  }
}

function currentKeySegment(prop, currentTime) {
  if (prop.numKeys < 2) {
    return null;
  }

  var n = prop.nearestKey(currentTime).index;
  if (prop.key(n).time > currentTime) {
    n--;
  }

  if (n < 1 || n >= prop.numKeys) {
    return null;
  }

  return { k1: prop.key(n), k2: prop.key(n + 1) };
}

function easeBetweenKeysExpo(prop, currentTime) {
  var seg = currentKeySegment(prop, currentTime);
  if (!seg) {
    return null;
  }

  var k1 = seg.k1;
  var k2 = seg.k2;
  if (currentTime < k1.time || currentTime > k2.time) {
    return null;
  }

  var localT = currentTime - k1.time;
  var duration = k2.time - k1.time;
  var dim = getDimFromKey(prop);

  if (dim === 1) {
    var start = k1[0];
    var change = k2[0] - k1[0];
    return easeInOutExpo(localT, start, change, duration);
  }

  if (dim === 2) {
    var startX = k1[0];
    var changeX = k2[0] - k1[0];
    var startY = k1[1];
    var changeY = k2[1] - k1[1];
    return [
      easeInOutExpo(localT, startX, changeX, duration),
      easeInOutExpo(localT, startY, changeY, duration),
    ];
  }

  var sx = k1[0];
  var cx = k2[0] - k1[0];
  var sy = k1[1];
  var cy = k2[1] - k1[1];
  var sz = k1[2];
  var cz = k2[2] - k1[2];
  return [
    easeInOutExpo(localT, sx, cx, duration),
    easeInOutExpo(localT, sy, cy, duration),
    easeInOutExpo(localT, sz, cz, duration),
  ];
}

easeBetweenKeysExpo(thisProperty, time) || value;
