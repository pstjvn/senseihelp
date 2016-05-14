goog.provide('help.component.IconAnimation');

goog.require('goog.functions');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Line');
goog.require('pstj.animation.State');

/**
 * Implements the icon animation for the help system.
 *
 * The animation is an arc that is 60 degrees in a circle constructed by
 * using the tip of a isosceles triangle as the center and the triangle
 * itself is being constructed using the start and end points as base.
 */
help.component.IconAnimation = goog.defineClass(null, {
  constructor: function() {
    /** @private {!goog.math.Coordinate} */
    this.pointA_ = new goog.math.Coordinate();
    /** @private {!goog.math.Coordinate} */
    this.pointB_ = new goog.math.Coordinate();
    /** @private {!goog.math.Coordinate} */
    this.pointC_ = new goog.math.Coordinate();
    /** @private {number} */
    this.duration_ = 1000;
    /** @private {!function(number): number} */
    this.timingFunction_ = goog.functions.identity;
    /** @private {number} */
    this.ts_ = 0;
  },

  /** @param {!goog.math.Coordinate} point */
  setStartPoint: function(point) {
    this.pointA_ = point;
  },

  /** @param {!goog.math.Coordinate} point */
  setEndPoint: function(point) {
    this.pointB_ = point;
  },

  /** @param {number} ms */
  setDuration: function(ms) {
    this.duration_ = ms;
  },

  /** @param {!function(number): number} fn */
  setTimingFunction: function(fn) {
    this.timingFunction_ = fn;
  },

  /**
   * Sets up the internal state so we can use the object to produce the
   * bindings.
   */
  setup: function() {
    this.findPointOfIsoscelesTriangle();
  },

  /**
   * Figures out the point that is the third point of an isosceles triangle
   * given the A and B points (the base of the triangle).
   * @protected
   */
  findPointOfIsoscelesTriangle: function() {
    var distance = goog.math.Coordinate.distance(this.pointA_, this.pointB_);
    var line = new goog.math.Line(this.pointA_.x, this.pointA_.y, this.pointB_.x, this.pointB_.y);
    var midPoint = line.getInterpolatedPoint(0.5);
    console.log(distance, midPoint, distance/2, goog.math.Coordinate.distance(this.pointA_, midPoint));
  },

  /**
   * Provides the measure phase.
   * @param {!pstj.animation.State} state
   */
  measure: function(state) {
    this.ts_ = state.timestamp;
  },

  /**
   * Provides the mutate phase
   * @param {!pstj.animation.State} state
   */
  mutate: function(state) {

  }
});

