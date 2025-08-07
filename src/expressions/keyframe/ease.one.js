/**
 * @author @chvndler
 *
 * @description easing function
 * @version 1.0.0
 */

function easeandwizz_inoutExpo(t, b, c, d) {
  var CORRECTION = 0.000976563;
  var v;
  if ((t /= d / 2) < 1) {
    v = Math.pow(2, 10 * (t - 1)) - CORRECTION;
  } else {
    v = -Math.pow(2, -10 * (t - 1)) + 2 + CORRECTION;
  }
  return b + (v / 2) * c;
}

function easeAndWizz() {
  var n = 0;
  if (numKeys > 0) {
    n = nearestKey(time).index;
    if (key(n).time > time) {
      n--;
    }
  }

  try {
    var key1 = key(n);
    var key2 = key(n + 1);
  } catch (e) {
    return null;
  }

  // determine how many dimensions the keyframes need
  var dim = 1; // It's gotta have at least ONE dimension
  try {
    key(1)[1];
    dim = 2;
    key(1)[2];
    dim = 3;
  } catch (e) {}

  t = time - key1.time;
  d = key2.time - key1.time;

  sX = key1[0];
  eX = key2[0] - key1[0];

  if (dim >= 2) {
    sY = key1[1];
    eY = key2[1] - key1[1];

    if (dim >= 3) {
      sZ = key1[2];
      eZ = key2[2] - key1[2];
    }
  }

  if (time < key1.time || time > key2.time) {
    return value;
  } else {
    val1 = easeandwizz_inoutExpo(t, sX, eX, d);
    switch (dim) {
      case 1:
        return val1;
        break;
      case 2:
        val2 = easeandwizz_inoutExpo(t, sY, eY, d);
        return [val1, val2];
        break;
      case 3:
        val2 = easeandwizz_inoutExpo(t, sY, eY, d);
        val3 = easeandwizz_inoutExpo(t, sZ, eZ, d);
        return [val1, val2, val3];
        break;
      default:
        return null;
    }
  }
}

easeAndWizz() || value;
