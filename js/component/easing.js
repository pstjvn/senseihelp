goog.provide('help.easing');

goog.require('goog.math.Bezier');

/** @private {!goog.math.Bezier} */
help.easing.scale_ = new goog.math.Bezier(0, 0, 1, 0, .72, .38, 1, 1);

/** @private {!goog.math.Bezier} */
help.easing.move_ = new goog.math.Bezier(0, 0, .64, .01, .68, 1, 1, 1);

/**
 * Timing function used for scaling animation.
 *
 * The animation starts very slow and after the 70% completion speeds up
 * exponentially.
 *
 * @param {number} t The progress of the animation, from 0 to 1.
 * @return {number} The scaling progression (from 0 to 1).
 */
help.easing.scale = function(t) {
  return help.easing.scale_.solveYValueFromXValue(t);
};

/**
 * Timing function used for movement animation.
 *
 * The animation starts slow, speeds up in the middle and slows down at the end.
 *
 * @param {number} t The progress of the animation, from 0 to 1.
 * @return {number} The scaling progression (from 0 to 1).
 */
help.easing.move = function(t) {
  return help.easing.move_.solveYValueFromXValue(t);
};

/**
 * The angle we will use in rotation - for now we use iso-triangle, thus
 * 60 degrees.
 * @const {!number}
 */
help.easing.Angle = 60;
