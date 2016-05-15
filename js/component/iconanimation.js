goog.provide('help.component.IconAnimation');

goog.require('goog.events.EventTarget');
goog.require('goog.functions');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.math');
goog.require('goog.math.Vec2');
goog.require('goog.style');
goog.require('help.easing');
goog.require('pstj.animation.browser');
goog.require('pstj.animation.create');
goog.require('pstj.animation.State');
goog.require('pstj.lab.style.css');
goog.require('pstj.math.utils');

/**
 * Implements the icon animation for the help system.
 *
 * The animation is an arc that is 60 degrees in a circle constructed by
 * using the tip of a isosceles triangle as the center and the triangle
 * itself is being constructed using the start and end points as base.
 */
help.component.IconAnimation = goog.defineClass(goog.events.EventTarget, {
  constructor: function() {
    goog.events.EventTarget.call(this);
    /** @private {number} */
    this.duration_ = 1000;
    /** @private {number} */
    this.ts_ = 0;
    /** @private {function(): void} */
    this.animation_ = pstj.animation.create(
        goog.asserts.assertFunction(goog.bind(this.measure, this)),
        goog.asserts.assertFunction(goog.bind(this.mutate, this)), null);
    /** @private {number} */
    this.startTime_ = 0;
    /** @private {?Element} */
    this.element_ = null;
    /** @private {?goog.math.Vec2} */
    this.elementVector_ = null;
    /** @private {?goog.math.Vec2} */
    this.pivotVector_ = null;
  },

  /** @param {number} ms */
  setDuration: function(ms) { this.duration_ = ms; },

  /** Starts the animation. Upon completion the end event will be fired. */
  play: function() {
    this.startTime_ = goog.now();
    goog.style.setStyle(
        this.element_,
        {'top': '0px', 'left': '0px', 'bottom': '', 'right': ''});
    this.animation_();
  },

  /**
   * Sets up the internal state so we can use the object to produce the
   * bindings.
   * @param {!Element} el The element we will be animating.
   * @param {!Element} targetElement The element which we want to measure and
   * animate to.
   */
  setup: function(el, targetElement) {
    this.element_ = el;
    var cr = targetElement.getBoundingClientRect();
    var ecr = el.getBoundingClientRect();
    this.elementVector_ = new goog.math.Vec2(ecr.left, ecr.top);
    this.pivotVector_ = this.calculatePivotVector(
        this.elementVector_, new goog.math.Vec2(cr.left, cr.top),
        help.easing.Angle);
  },

  /**
   * Given the point to rotate and a pivot point - rotates the point to 60
   * degrees counter clockwise.
   *
   * @protected
   * @param {!goog.math.Vec2} vec1
   * @param {!goog.math.Vec2} vec2
   * @param {number} degrees The rotation to apply - in degrees.
   * @return {!goog.math.Vec2}
   */
  calculatePivotVector: function(vec1, vec2, degrees) {
    return goog.math.Vec2.rotateAroundPoint(
        vec1, vec2, goog.math.toRadians(degrees));
  },

  /**
   * Provides the measure phase.
   * @param {pstj.animation.State} state
   */
  measure: function(state) { this.ts_ = state.timestamp; },

  /**
   * Provides the mutate phase
   * @param {pstj.animation.State} state
   */
  mutate: function(state) {
    var fraction = pstj.math.utils.getFractionFromValue(
        this.ts_ - this.startTime_, this.duration_);
    if (fraction < 1) {
      this.animation_();
    } else if (fraction > 1) {
      this.dispatchEvent(goog.fx.Transition.EventType.FINISH);
      return;
    }
    var pos = this.calculatePivotVector(
        goog.asserts.assertInstanceof(this.elementVector_, goog.math.Vec2),
        goog.asserts.assertInstanceof(this.pivotVector_, goog.math.Vec2),
        (help.easing.Angle * help.easing.move(fraction) * -1));
    var scale =
        (1.1 -
         pstj.math.utils.crossRule(0, 1, 0.1, 1, help.easing.scale(fraction)));
    if (goog.DEBUG) {
      var div = document.createElement('div');
      goog.style.setStyle(div, {
        'background-color': 'red',
        'width': '5px',
        'height': '5px',
        'position': 'fixed',
        'top': pos.y + 'px',
        'left': pos.x + 'px'
      });
      document.body.appendChild(div);
    }
    pstj.lab.style.css.setTranslation(
        this.element_, pos.x, pos.y, 'px', `scale(${scale})`);
  }
});
