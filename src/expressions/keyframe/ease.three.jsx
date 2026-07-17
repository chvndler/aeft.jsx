/**
 * @author @chvndler
 *
 * @description easing function
 * @version 1.0.0
 */

// Drop on any keyframed property (1D/2D/3D). Only affects time BETWEEN keys.

function easeInOutExpo(t, b, c, d) {
  var CORRECTION = 1 / 1024; // avoids tiny edge artifacts
  var v;

  if (d === 0) return b;

  t /= d / 2; // normalize to 0..2

  if (t < 1) {
    v = Math.pow(2, 10 * (t - 1)) - CORRECTION; // ease-in
  } else {
    v = -Math.pow(2, -10 * (t - 1)) + 2 + CORRECTION; // ease-out
  }

  return b + v * 0.5 * c; // v/2 maps to 0..1
}

function getDimFromKey(prop) {
  // Returns 1, 2, or 3 based on the shape of key(1)
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

function currentKeySegment(prop, t) {
  // Returns {k1, k2} for the segment containing time t, or null if none.
  if (prop.numKeys < 2) return null;

  var n = prop.nearestKey(t).index;
  if (prop.key(n).time > t) n--;

  if (n < 1 || n >= prop.numKeys) return null;

  return { k1: prop.key(n), k2: prop.key(n + 1) };
}

function easeBetweenKeysExpo(prop, t) {
  var seg = currentKeySegment(prop, t);
  if (!seg) return null;

  var k1 = seg.k1;
  var k2 = seg.k2;

  if (t < k1.time || t > k2.time) return null;

  var lt = t - k1.time; // local time into the segment
  var d = k2.time - k1.time; // segment duration
  var dim = getDimFromKey(prop);

  // Build result per dimension
  if (dim === 1) {
    var s = k1[0];
    var c = k2[0] - k1[0];
    return easeInOutExpo(lt, s, c, d);
  }

  if (dim === 2) {
    var sx = k1[0],
      cx = k2[0] - k1[0];
    var sy = k1[1],
      cy = k2[1] - k1[1];
    return [easeInOutExpo(lt, sx, cx, d), easeInOutExpo(lt, sy, cy, d)];
  }

  // dim === 3
  var sx3 = k1[0],
    cx3 = k2[0] - k1[0];
  var sy3 = k1[1],
    cy3 = k2[1] - k1[1];
  var sz3 = k1[2],
    cz3 = k2[2] - k1[2];
  return [easeInOutExpo(lt, sx3, cx3, d), easeInOutExpo(lt, sy3, cy3, d), easeInOutExpo(lt, sz3, cz3, d)];
}

// Apply
easeBetweenKeysExpo(thisProperty, time) || value;
