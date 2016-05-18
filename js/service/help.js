goog.provide('help.service.Help');

goog.require('goog.net.IframeLoadMonitor');
goog.require('help.component.Container');
goog.require('help.ids');
goog.require('help.topic');
goog.require('pstj.control.Control');

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
  /**
   * @protected
   * @type {?HTMLIFrameElement}
   */
  this.frame = null;
  /** @private {boolean} */
  this.isReady_ = false;
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
          monitor.dispose();
        }, false, this);
  }
  if (goog.isNull(this.helpContainer_)) {
    this.helpContainer_ = new help.component.Container();
    this.helpContainer_.render(document.body);
    this.helpContainer_.getContentElement().appendChild(this.frame);
  }
};

/** Handles the requests comming for showing the intro. */
help.service.Help.prototype.handleIntroRequest = function() {
  console.log('Hanleeee');
  if (!this.isReady_) {
    console.log('Not ready yet');
  } else {
    this.helpContainer_.setOpen(true);
    console.log('Frame is ready');
  }
};

/** Handles the requests comming for showing the intro. */
help.service.Help.prototype.handleIndexRequest = function() {

};


/** Handles the requests comming for showing the intro. */
help.service.Help.prototype.handleHideRequest = function() {

};
