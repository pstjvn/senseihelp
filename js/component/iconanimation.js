goog.provide('help.component.IconAnimation');

goog.require('goog.functions');
goog.require('goog.math.Bezier');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Line');
goog.require('pstj.animation.State');
goog.require('pstj.animation.RafSI');
goog.require('pstj.animation.create');
goog.require('pstj.lab.style.css');
goog.require('pstj.math.utils');

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
    /** @private {function(): void} */
    this.animation_ = pstj.animation.create(
        goog.asserts.assertFunction(goog.bind(this.measure, this)),
        goog.asserts.assertFunction(goog.bind(this.mutate, this)), null);
    /** @private {number} */
    this.startTime_ = 0;
    /** @private {number} */
    this.endTime_ = 0;
    this.element_ = null;
  },

  setElement: function(el) {
    this.element_ = el;
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

  start: function() {
    this.startTime_ = goog.now();
    this.endTime_ = this.startTime_ + this.duration_;
    this.animation_();
  },

  /**
   * Sets up the internal state so we can use the object to produce the
   * bindings.
   */
  setup: function(el) {
    this.element_ =  el;
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
   * @param {pstj.animation.State} state
   */
  measure: function(state) {
    this.ts_ = state.timestamp;
  },

  /**
   * Provides the mutate phase
   * @param {pstj.animation.State} state
   */
  mutate: function(state) {
    var fraction = pstj.math.utils.getFractionFromValue(this.ts_ - this.startTime_, this.duration_);
    if (fraction < 1) {
      this.animation_();
    }
    pstj.lab.style.css.setTranslationText(this.element_, 'scale(' +
        (1 - help.component.IconAnimation.ScaleBezier.solveYValueFromXValue(fraction)) +
        ')');
    // console.log(help.component.IconAnimation.ScaleBezier.solveYValueFromXValue(fraction));
  },

  statics: {
    /**
     * Provides the bezier curve to be used for scaling.
     * const {!goog.math.Bezier}
     */
    ScaleBezier: new goog.math.Bezier(0, 0, 1, 0, 1, 0.09, 1, 1)
  }
});

pstj.animation.Scheduler.setSchedulerImplementation(new pstj.animation.RafSI());

