goog.provide('help.service.Viz');

goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('help.component.Main');
goog.require('help.message');
goog.require('help.template');
goog.require('pstj.control.Control');

help.service.Viz = class extends pstj.control.Control {
  constructor() {
    super();
    this.main_ = new help.component.Main();
    this.main_.render(document.body);
  }

  /** @override */
  init() {
    super.init();
    this.getHandler().listen(
        window, goog.events.EventType.MESSAGE, this.handleMessage);
  }

  /** @param {goog.events.Event} e */
  handleMessage(e) {
    var message = e.getBrowserEvent()['data'];
    if (message == help.message.INTRO) {
      var node =
          goog.dom.safeHtmlToNode(help.template.Introduction().toSafeHtml());
      this.main_.getElement().appendChild(node);
    }
  }
};
goog.addSingletonGetter(help.service.Viz);
