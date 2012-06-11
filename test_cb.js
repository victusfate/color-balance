var cb, color_balance, hsl_to_rgb, hsl_value, rgb_to_hsl, root;
root = typeof exports !== "undefined" && exports !== null ? exports : this;
rgb_to_hsl = function(r, g, b) {
  var delta, h, l, max, min, s, _ref;
  _ref = [0, 0, 0], h = _ref[0], s = _ref[1], l = _ref[2];
  max = Math.max(r, Math.max(g, b));
  min = Math.min(r, Math.min(g, b));
  l = (max + min) / 2;
  if (max === min) {
    s = 0.0;
    h = void 0;
  } else {
    if (l <= 128) {
      s = 255 * (max - min) / (max + min);
    } else {
      s = 255 * (max - min) / (511 - max - min);
    }
    delta = max - min;
    if (delta === 0) {
      delta = 1;
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h = h + 42.5;
    if (h < 0.0) {
      h += 255;
    } else if (h > 255) {
      h -= 255;
    }
  }
  return [Math.round(h), Math.round(s), Math.round(l)];
};
hsl_value = function(n1, n2, hue) {
  var value;
  if (hue > 255) {
    hue -= 255;
  } else if (hue < 0) {
    hue += 255;
  }
  if (hue < 42.5) {
    value = n1 + (n2 - n1) * (hue / 42.5);
  } else if (hue < 127.5) {
    value = n2;
  } else if (hue < 170) {
    value = n1 + (n2 - n1) * ((170 - hue) / 42.5);
  } else {
    value = n1;
  }
  return Math.round(value * 255.0);
};
hsl_to_rgb = function(h, s, l) {
  var b, g, m1, m2, r, _ref;
  _ref = [0, 0, 0], r = _ref[0], g = _ref[1], b = _ref[2];
  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    if (l < 128) {
      m2 = (l * (255 + s)) / 65025.0;
    } else {
      m2 = (l + s - (l * s) / 255.0) / 255.0;
    }
    m1 = (l / 127.5) - m2;
    h = hsl_value(m1, m2, h + 85);
    s = hsl_value(m1, m2, h);
    l = hsl_value(m1, m2, h - 85);
  }
  return [r, g, b];
};
color_balance = function(val, l, sup, mup, dvs, dvm, dvh) {
  var value;
  value = 0;
  if (l < sup) {
    value += dvs;
  } else if (l < mup) {
    value += dvm;
  } else {
    value += dvh;
  }
  return value = Math.min(255, Math.max(0, value));
};
cb = function(canvas_id, sup, mup, dvs, dvm, dvh) {
  var b, canvas, data, dim, dvhb, dvhg, dvhr, dvmb, dvmg, dvmr, dvsb, dvsg, dvsr, g, h, height, i, i1, i2, l, r, s, width, _ref, _ref2, _ref3, _ref4;
  _ref = [dvs.r, dvs.g, dvs.b], dvsr = _ref[0], dvsg = _ref[1], dvsb = _ref[2];
  _ref2 = [dvm.r, dvm.g, dvm.b], dvmr = _ref2[0], dvmg = _ref2[1], dvmb = _ref2[2];
  _ref3 = [dvh.r, dvh.g, dvh.b], dvhr = _ref3[0], dvhg = _ref3[1], dvhb = _ref3[2];
  canvas = $('#' + canvas_id);
  width = canvas.width;
  height = canvas.height;
  data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  dim = width * height;
  i = 0;
  while (i < dim) {
    i1 = i + 1;
    i2 = i + 2;
    r = data[i];
    g = data[i1];
    b = data[i2];
    _ref4 = rgb_to_hsl(r, g, b), h = _ref4[0], s = _ref4[1], l = _ref4[2];
    data[i] = color_balance(r, l, sup, mup, dvsr, dvsg, dvsb);
    data[i1] = color_balance(g, l, sup, mup, dvmr, dvmg, dvmb);
    data[i2] = color_balance(b, l, sup, mup, dvhr, dvhg, dvhb);
    i += 4;
  }
};
root.cb = cb;