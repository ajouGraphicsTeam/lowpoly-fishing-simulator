"use strict";

var gl;

const DRAW_TYPE = {
  POINT: 0, // gl.POINTS
  LINE: 1, // gl.LINES
  LINE_LOOP: 2, // gl.LINE_LOOP
  LINE_STRIP: 3, // gl.LINE_STRIP
  TRIANGLE: 4, // gl.TRIANGLES
  TRIANGLE_STRIP: 5, // gl.TRIANGLE_STRIP
  TRIANGLE_FAN: 6, // gl.TRIANGLE_FAN

  CUSTOM_HEXAHEDRON: 10, // custom
};
