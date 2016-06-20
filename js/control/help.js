/**
 * @fileoverview This is the main logical netry point for the help sysytem
 * that you would like to inject into the existing application.
 *
 * It exports everything needed to operate properly as help system.
 *
 * The triggers for externalizing the functionlity (exposing it for consumption
 * from third party code that will NOT be cmopiled together with this unit
 * is to be found in 'inject.js').
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('help.control.Help');

goog.require('goog.Promise');
goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.net.IframeLoadMonitor');
goog.require('help.component.Container');
goog.require('help.component.IconContainer');
goog.require('help.service.Highlighter');
goog.require('help.topic');

help.control.Help = class extends pstj.control.Control {
  constructor() {
    super();
    /** @private {!help.component.Container} */
    this.helpContainer_ = new help.component.Container();
    /** @private {!help.component.IconContainer} */
    this.iconContainer_ = new help.component.IconContainer();
    /** @private {?goog.Promise<!HTMLIFrameElement>} */
    this.helpViewerFramePromise_ = null;
    /** @private {?Window} */
    this.channel_ = null;
    /**
     * Delays the highligher - it is a component that is used to find all
     * marked elements in the markup and show indexes on them. We need to
     * delay this operation because otherwise it will block the rendering
     * of the animation for showing the help frame.
     *
     * @private {!goog.async.Delay}
     */
    this.delay_ = new goog.async.Delay(function() {
      console.log('Set classes');
      highlighter.setEnabled(true)
    }, 500);
    /** @private {!goog.async.Delay} */
    this.hideDelay_ = new goog.async.Delay(function() {
      this.helpContainer_.setOpen(false);
      if (this.iconContainer_.isInDocument()) {
        var el = document.querySelector('.help-hide-target');
        var cr = el.getBoundingClientRect();
        var point = new goog.math.Coordinate(cr.left, cr.top);
        this.iconContainer_.goToPoint(
            point, help.animation.Arc.Quadrant.THREE, true, true);
      }
    }, 120, this);
  }

  /** @override */
  init() {
    super.init();
    this.listen(help.topic.SHOW_INTRO, this.handleShowIntroRequest);
    this.listen(help.topic.SHOW_INDEX, this.handleShowIndexRequest);
    this.listen(help.topic.HIDE, this.handleHideRequest);
    this.initializeViewerFrame_();
    // Setup UI components...
    this.helpContainer_.render(document.body);
    this.helpViewerFramePromise_.then(function(frame) {
      this.helpContainer_.getContentElement().appendChild(this.frame);
    });
    this.iconContainer_.setVisible(false);
    this.iconContainer_.render(document.body);
  }

  /**
   * @private
   * @return {!HTMLIFrameElement}
   */
  cerateFrame_() {
    return (/** @type {!HTMLIFrameElement} */ (goog.dom.createDom('iframe', {
      'src': help.service.FRAME_URL,
      'width': '100%',
      'height': '100%',
      'frameBorder': '0'
    })));
  }

  resolver_(resolve, reject) {
    if (this.frame != null) {
      var flm = new goog.net.IframeLoadMonitor(this.createFrame_());
      goog.events.listenOnce(flm, goog.net.IframeLoadMonitor.LOAD_EVENT, function(e) {
        var frame = flm.getIFrame();
        flm.dispose();
        resolve(frame);
      });
    } else {
      reject(new Error('Frame already exists, reject promise for new frame'));
    }
  }

  /**
   * Sets up the window for the help system.
   * @param {!HTMLIFrameElement} frame
   * @private
   */
  setupChannel_(frame) {
    this.channel_ = goog.dom.getFrameContentWindow(frame);
  }

  /**
   * Handles the rejection of the frame promise.
   * @param {Error} e
   * @private
   */
  handleFrameError_(e) {
    throw new Error('Cannot establish link to help viewer frame');
  }

  /**
   * Takes care of creating the promise for the loaded iframe.
   * @private
   */
  initializeViewerFrame_() {
    if (this.helpViewerFramePromise_ != null) return;
    this.helpViewerFramePromise_ = new goog.Promise(this.resolver_, this);
    this.helpViewerFramePromise_.then(this.setupChannel_, this.handleFrameError_, this);
  }

  /**
   * Sends a message via the channel (when opened).
   * @param {!app.gen.dto.Message} msg
   */
  sendMessage(msg) {
    var message = msg.toJSON();
    this.helpViewerFramePromise_.thenVoid(function(_) {
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
    }, null, this);
  }

  /** Helper function */
  showIcon() {
    this.iconContainer_.setVisible(true);
  }
}


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
