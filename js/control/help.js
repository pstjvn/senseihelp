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

goog.require('app.gen.dto.Message');
goog.require('goog.Promise');
goog.require('goog.async.Delay');
goog.require('goog.async.nextTick');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events');
goog.require('goog.json');
goog.require('goog.log');
goog.require('goog.math.Coordinate');
goog.require('goog.net.IframeLoadMonitor');
goog.require('goog.net.ImageLoader');
goog.require('goog.style');
goog.require('help.animation.Arc');
goog.require('help.component.Container');
goog.require('help.component.IconContainer');
goog.require('help.message');
goog.require('help.service.Highlighter');
goog.require('help.topic');

/** Implements the help controller */
help.control.Help = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /** @private {!help.component.Container} */
    this.helpContainer_ = new help.component.Container();
    /** @private {!help.component.IconContainer} */
    this.iconContainer_ = new help.component.IconContainer();
    /** @private {?goog.Promise<!HTMLIFrameElement>} */
    this.helpViewerFramePromise_ = null;
    /** @private {?Window} */
    this.channel_ = null;
    /** @private {boolean} */
    this.isFirst_ = false;
    /** @private {Image} */
    this.image_ = null;
    /**
     * Delays the highligher - it is a component that is used to find all
     * marked elements in the markup and show indexes on them. We need to
     * delay this operation because otherwise it will block the rendering
     * of the animation for showing the help frame.
     *
     * @private {!goog.async.Delay}
     */
    this.delay_ = new goog.async.Delay(function() {
      goog.log.info(this.logger, 'Activating highligher service');
      help.service.Highlighter.getInstance().setEnabled(true)
    }, 500, this);
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
  },

  /**
   * Logger test
   * @type {goog.debug.Logger}
   * @protected
   */
  logger: goog.log.getLogger('help.control.Help'),

  /** @override */
  init: function() {
    goog.base(this, 'init');
    this.listen(help.topic.FIRST_TIME, this.handleFirstTime);
    this.listen(help.topic.SHOW_HELP_INTRO, this.handleShowIntroRequest);
    this.listen(help.topic.SHOW_INDEXED_HELP, this.handleShowIndexRequest);
    this.listen(help.topic.HIDE, this.handleHideRequest);
    this.listen(help.topic.LOCATION, this.handleLocationChange);
    // Setup UI components...
    this.helpContainer_.render(document.body);
    this.iconContainer_.setVisible(false);
    this.iconContainer_.render(document.body);
    // When we destroy the icon we need to show the popup as per client request
    this.iconContainer_.addOnDisposeCallback(function() {
      var el = document.querySelector('.help-hide-target');
      var cr = el.getBoundingClientRect();
      var point = new goog.math.Coordinate(cr.left, cr.top);
      var size = goog.dom.ViewportSizeMonitor.getInstanceForWindow().getSize();
      var img = new Image();
      img.src = help.control.Help.IMAGE_URL;
      goog.style.setStyle(img, {
        'position': 'fixed',
        'right': `${size.width - point.x - 30}px`,
        'top': `${point.y + 30}px`
      });
      document.body.appendChild(img);
      setTimeout(function() {
        goog.dom.removeNode(img);
      }, 30000);
    }, this);
    var il = new goog.net.ImageLoader();
    goog.events.listenOnce(il, goog.net.EventType.COMPLETE, function(e) {
      goog.log.info(this.logger, 'Image has been preloaded');
      il.dispose();
    }, false, this);
    il.addImage('myimage', help.control.Help.IMAGE_URL);
    il.start();
    this.initializeViewerFrame_();
  },

  /**
   * @param {string} str
   * @protected
   */
  handleLocationChange: function(str) {
    if (!this.isFirst_) this.handleHideRequest();
    goog.log.info(this.logger, 'Requesting change of location: ' + str);
    var msg = new app.gen.dto.Message();
    msg.type = help.message.Type.LOCATION;
    msg.url = str;
    this.sendMessage(msg);
  },

  /**
   * @param {number} idx
   * @protected
   */
  handleShowIndexRequest: function(idx) {
    goog.log.info(this.logger, 'Requesting show of indexed help: ' + idx);
    var msg = new app.gen.dto.Message();
    msg.type = help.message.Type.INDEX;
    msg.helpIndex = idx;
    this.sendMessage(msg);
  },

  /**
   * Handle regular show request.
   * @protected
   */
  handleShowIntroRequest: function() {
    goog.log.info(this.logger, 'Show intro for particulat location.');
    this.helpContainer_.setOpen(true);
  },

  /**
   * Handle the hiding of the help view container.
   * @protected
   */
  handleHideRequest: function() {
    goog.log.info(this.logger, 'Hide the help system');
    if (this.isFirst_) {
      this.isFirst_ = false;
      this.hideDelay_.start();
      this.helpContainer_.removeClassName('first-time');
      // this.iconContainer_.goToTarget()
    }
    this.helpContainer_.setOpen(false);
  },

  /**
   * Handles the first time request.
   * @protected
   */
  handleFirstTime: function() {
    goog.log.info(this.logger, 'Show first time intro');
    this.isFirst_ = true;
    this.helpContainer_.addClassName('first-time');
    var msg = new app.gen.dto.Message();
    msg.type = help.message.Type.FIRSTTIME;
    goog.log.info(this.logger, 'Send first time message');
    this.sendMessage(msg);
    this.helpContainer_.setOpen(true);
    this.iconContainer_.setVisible(true);
    goog.async.nextTick(function() {
      this.iconContainer_.goToPoint(null, help.animation.Arc.Quadrant.TWO);
    }, this);
  },

  /**
   * @private
   * @return {!HTMLIFrameElement}
   */
  createFrame_: function() {
    return (/** @type {!HTMLIFrameElement} */ (goog.dom.createDom('iframe', {
      'src': help.control.Help.FRAME_URL,
      'width': '100%',
      'height': '100%',
      'frameBorder': '0'
    })));
  },

  resolver_: function(resolve, reject) {
    var frame = this.createFrame_();
    var flm = new goog.net.IframeLoadMonitor(frame);
    goog.events.listenOnce(flm, goog.net.IframeLoadMonitor.LOAD_EVENT, function(e) {
      goog.log.info(this.logger, 'Frame has loaded in DOM');
      var frame = flm.getIframe();
      flm.dispose();
      resolve(frame);
    }, false, this);
    this.helpContainer_.getContentElement().appendChild(frame);
    goog.log.info(this.logger, 'Attached frame to DOM');

  },

  /**
   * Sets up the window for the help system.
   * @param {!HTMLIFrameElement} frame
   * @private
   */
  setupChannel_: function(frame) {
    goog.log.info(this.logger, 'Initialized the frame channel');
    this.channel_ = goog.dom.getFrameContentWindow(frame);
  },

  /**
   * Handles the rejection of the frame promise.
   * @param {*} e
   * @private
   */
  handleFrameError_: function(e) {
    throw new Error('Cannot establish link to help viewer frame');
  },

  /**
   * Takes care of creating the promise for the loaded iframe.
   * @private
   */
  initializeViewerFrame_: function() {
    goog.log.info(this.logger, 'Check for viewer frame');
    if (this.helpViewerFramePromise_ != null) return;
    goog.log.info(this.logger, 'Initializing frame');
    this.helpViewerFramePromise_ = new goog.Promise(this.resolver_, this);
    this.helpViewerFramePromise_.then(this.setupChannel_, this.handleFrameError_, this);
  },

  /**
   * Sends a message via the channel (when opened).
   * @param {!app.gen.dto.Message} msg
   */
  sendMessage: function(msg) {
    var message = msg.toJSON();
    goog.log.info(this.logger, 'About to send message...');
    this.helpViewerFramePromise_.then(function(_) {
      goog.log.info(this.logger, 'Sending message over channel');
      this.channel_.postMessage(goog.json.serialize(message), '*');
      if (msg.type != help.message.Type.LOCATION) {
        goog.log.info(this.logger, 'Help viewer is not open, opening it');
        if (!this.iconContainer_.isOpen()) {
          this.getHandler().listenOnce(
            this.helpContainer_.getElement(), goog.events.EventType.TRANSITIONEND,
              function() {
                this.delay_.start();
              });
        }
      }
    }, null, this);
  }
});
goog.addSingletonGetter(help.control.Help);

/**
 * @define {string} URL of the frame help.
 */
goog.define('help.control.Help.FRAME_URL', 'helpsystem.html');

/**
 * @define {string} URL for image.
 */
goog.define('help.control.Help.IMAGE_URL', 'assets/popout.png');
