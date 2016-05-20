goog.provide('help.service.Help');

goog.require('goog.async.Delay');
goog.require('goog.math.Coordinate');
goog.require('goog.net.IframeLoadMonitor');
goog.require('help.component.Container');
goog.require('help.component.IconContainer');
goog.require('help.ids');
goog.require('help.message');
goog.require('help.service.Highlighter');
goog.require('help.topic');
goog.require('pstj.control.Control');

goog.scope(function() {

var highlighter = goog.module.get('help.service.Highlighter');
var Delay = goog.async.Delay;
var Coordinate = goog.math.Coordinate;

/** @define {string} The irl from which to load the help frame. */
goog.define('help.service.FRAME_URL', 'index.html');

/**
 * @constructor
 * @extends {pstj.control.Control}
 * @struct
 */
help.service.Help = function() {
  pstj.control.Control.call(this);
  /** @private {?help.component.Container} */
  this.helpContainer_ = null;
  /** @private {?help.component.IconContainer} */
  this.iconContainer_ = null;
  /**
   * @protected
   * @type {?HTMLIFrameElement}
   */
  this.frame = null;
  /** @private {boolean} */
  this.isReady_ = false;
  /** @private {?Window} */
  this.channel_ = null;
  /** @private {!Delay} */
  this.delay_ = new Delay(function() {
    console.log('Set classes');
    highlighter.setEnabled(true)
  }, 500);
  this.hideDelay_ = new Delay(function() {
    this.helpContainer_.setOpen(false);
    if (this.iconContainer_.isInDocument()) {
      var el = document.querySelector('.help-hide-target');
      var cr = el.getBoundingClientRect();
      var point = new goog.math.Coordinate(cr.left, cr.top);
      this.iconContainer_.goToPoint(
          point, help.animation.Arc.Quadrant.THREE, true, true);
    }
  }, 50, this);
  this.init();
  this.initFrame();
};
goog.inherits(help.service.Help, pstj.control.Control);

/** @override */
help.service.Help.prototype.init = function() {
  goog.base(this, 'init');
  this.listen(help.topic.SHOW_HELP_INTRO, this.handleIntroRequest);
  this.listen(help.topic.SHOW_INDEXED_HELP, this.handleIndexRequest);
  this.listen(help.topic.HIDE, this.handleHideRequest);
};

/** info */
help.service.Help.prototype.initFrame = function() {
  if (goog.isNull(this.frame)) {
    this.frame =
        (/** @type {!HTMLIFrameElement} */ (goog.dom.createDom('iframe', {
          'src': help.service.FRAME_URL,
          'width': '100%',
          'height': '100%',
          'frameBorder': '0'
        })));
    var monitor =
        new goog.net.IframeLoadMonitor(goog.asserts.assert(this.frame));
    goog.events.listenOnce(
        monitor, goog.net.IframeLoadMonitor.LOAD_EVENT, function() {
          this.isReady_ = true;
          this.channel_ = goog.dom.getFrameContentWindow(this.frame);
          monitor.dispose();
        }, false, this);
  }

  if (goog.isNull(this.helpContainer_)) {
    this.helpContainer_ = new help.component.Container();
    this.helpContainer_.render(document.body);
    this.helpContainer_.getContentElement().appendChild(this.frame);
  }

  if (goog.isNull(this.iconContainer_)) {
    this.iconContainer_ = new help.component.IconContainer();
    this.iconContainer_.setVisible(false);
    this.iconContainer_.render(document.body);
  }
};

/** Handles the requests comming for showing the intro. */
help.service.Help.prototype.handleIntroRequest = function() {
  if (this.iconContainer_.isInDocument()) {
    this.iconContainer_.goToPoint(null, help.animation.Arc.Quadrant.TWO);
  }
  this.sendMessage(help.message.INTRO);
};

/** @param {help.message} message */
help.service.Help.prototype.sendMessage = function(message) {
  if (!this.isReady_) throw new Error('Frame not yet ready');
  if (!this.helpContainer_.isOpen()) {
    this.helpContainer_.setOpen(true);
    this.getHandler().listenOnce(
        this.helpContainer_.getElement(), goog.events.EventType.TRANSITIONEND,
        function() {
          this.delay_.start();
          this.channel_.postMessage(message, '*');
        });
  } else {
    this.channel_.postMessage(message, '*');
  }
};

/** Handles the requests comming for showing the intro. */
help.service.Help.prototype.handleIndexRequest = function(idx) {

};


/** Handles the requests comming for showing the intro. */
help.service.Help.prototype.handleHideRequest = function() {
  highlighter.setEnabled(false);
  this.hideDelay_.start();
};

help.service.Help.prototype.activateForUrl = function(url) {
  this.sendMessage(help.message.HEAD);
};

help.service.Help.prototype.showIcon = function() {
  this.iconContainer_.setVisible(true);
};

});  // goog.scope
