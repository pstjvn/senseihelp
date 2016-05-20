goog.provide('help.component.IconAnimation');

goog.require('goog.events.EventTarget');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.math.Coordinate');
goog.require('goog.style');
goog.require('help.animation.Arc');
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
    /** @private {boolean} */
    this.useScaling_ = false;
    /** @private {number} */
    this.duration_ = 1000;
    /** @private {number} */
    this.ts_ = 0;
    /** @private {function(): void} */
    this.animation_ = pstj.animation.create(
        goog.asserts.assertFunction(goog.bind(this.measure, this)),
        goog.asserts.assertFunction(goog.bind(this.mutate, this)), null);
    /** @private {!help.animation.Arc} */
    this.animationConfig_ = new help.animation.Arc();
    /** @private {number} */
    this.startTime_ = 0;
    /** @private {?Element} */
    this.element_ = null;
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
   * @param {!goog.math.Coordinate} toPoint The point to which to animate.
   * @param {help.animation.Arc.Quadrant} quadrant
   * @param {boolean=} opt_usescale If we should use the scale as well.
   */
  setup: function(el, toPoint, quadrant, opt_usescale) {
    this.useScaling_ = !!opt_usescale;
    this.element_ = el;
    var elrect = el.getBoundingClientRect();
    this.setupAnimationConfig(
        new goog.math.Coordinate(elrect.left, elrect.top), toPoint, quadrant);
  },

  /**
   * Updates the config of the animation point provider.
   * @param {!goog.math.Coordinate} sp
   * @param {!goog.math.Coordinate} ep
   * @param {help.animation.Arc.Quadrant} quadrant
   */
  setupAnimationConfig: function(sp, ep, quadrant) {
    this.animationConfig_.fromPoints(sp, ep, quadrant);
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
    } else if (fraction >= 1) {
      this.dispatchEvent(goog.fx.Transition.EventType.FINISH);
      pstj.lab.style.css.clearTranslation(this.element_);
      return;
    }
    var pos = this.animationConfig_.getPoint(help.easing.move(fraction));
    var scale = '';
    if (this.useScaling_) {
      scale = 'scale(' + (1.1 -
                          pstj.math.utils.crossRule(
                              0, 1, 0.1, 1, help.easing.scale(fraction))) +
          ')';
    }
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
    pstj.lab.style.css.setTranslation(this.element_, pos.x, pos.y, 'px', scale);
  }
});
