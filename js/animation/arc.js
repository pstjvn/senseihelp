goog.provide('help.animation.Arc');

goog.require('goog.math');
goog.require('goog.math.Coordinate');

/** Provides means to use Arc animation as part of elipsis. */
help.animation.Arc = class {
  constructor() {
    // /** @private {!goog.math.Coordinate} */
    // this.startPoint_ = new goog.math.Coordinate();
    // /** @private {!goog.math.Coordinate} */
    // this.endPoint_ = new goog.math.Coordinate();
    /** @private {!goog.math.Coordinate} */
    this.centerPoint_ = new goog.math.Coordinate();
    /** @private {!goog.math.Coordinate} */
    this.targetPoint_ = new goog.math.Coordinate();
    /** @private {boolean} */
    this.clockWise_ = true;
    /** @type {number} */
    this.startAngle_ = 0;
    /** @type {number} */
    this.endAngle_ = 0;
    /** @type {number} */
    this.animateableAngles_ = 0;
    /** @type {number} */
    this.rx_ = 0;
    /** @type {number} */
    this.ry_ = 0;
  }

  /**
   * Setup the animation based on two points and quadrant animation we
   * want to perform.
   *
   * @param {!goog.math.Coordinate} sp The start point of the animation.
   * @param {!goog.math.Coordinate} ep The end point.
   * @param {help.animation.Arc.Quadrant} quadrant The quadrant we want to
   *  animate.
   */
  fromPoints(sp, ep, quadrant) {

    // this.startPoint_ = sp;
    // this.endPoint_ = ep;

    // If we are going to animate clockwise (i.e. counter pi)
    if (this.clockWise_) {
      // calculate the angles
      this.startAngle_ = 90 * quadrant;
      this.endAngle_ = 90 * quadrant + 90;
      this.animateableAngles_ = this.endAngle_ - this.startAngle_;

      // Calculate the center point based on quadrant and rotation.
      if (quadrant == help.animation.Arc.Quadrant.THREE) {
        this.centerPoint_.x = ep.x;
        this.centerPoint_.y = sp.y;
        this.rx_ = ep.x - sp.x;
        this.ry_ = sp.y - ep.y;
      } else if (quadrant == help.animation.Arc.Quadrant.TWO) {
        this.centerPoint_.x = sp.x;
        this.centerPoint_.y = ep.y;
        this.rx_ = sp.x - ep.x;
        this.ry_ = sp.y - ep.y;
      } else if (quadrant == help.animation.Arc.Quadrant.ONE) {
        this.centerPoint_.x = ep.x;
        this.centerPoint_.y = sp.y;
        this.rx_ = sp.x - ep.x;
        this.ry_ = ep.y - sp.y;
      } else if (quadrant == help.animation.Arc.Quadrant.FOUR) {
        this.centerPoint_.x = sp.x;
        this.centerPoint_.y = ep.y;
        this.rx_ = ep.x - sp.x;
        this.ry_ = ep.y - sp.y
      }
    }
  }

  /**
   * Calculates the point based on the angle of the elipsis we want. It will be
   * a fraction of 90 degrees and will be clculated compared to the start angle.
   *
   * @param {number} progress The progress of the animation (from 0 to 1).
   * @return {!goog.math.Coordinate}
   */
  getPoint(progress) {
    var diffangle = this.animateableAngles_ * progress;
    var lookedUpAngle = 0;
    if (this.clockWise_) {
      lookedUpAngle = this.startAngle_ + diffangle;
    } else {
      lookedUpAngle = this.startAngle_ - diffangle;
    }
    this.targetPoint_.x = this.centerPoint_.x +
        this.rx_ * Math.cos(goog.math.toRadians(lookedUpAngle));
    this.targetPoint_.y = this.centerPoint_.y +
        this.ry_ * Math.sin(goog.math.toRadians(lookedUpAngle));
    return this.targetPoint_;
  }
};


/** @enum {number} */
help.animation.Arc.Quadrant = {
  'ONE': 0,
  'TWO': 1,
  'THREE': 2,
  'FOUR': 3
};
