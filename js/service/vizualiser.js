goog.provide('help.service.Viz');

goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.json');
goog.require('help.component.Main');
goog.require('help.message');
goog.require('help.template');
goog.require('pstj.control.Control');
goog.require('app.gen.dto.Message');

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
        window, goog.events.EventType.MESSAGE, this.handleMessage_);
  }

  test() {
    var msg = new app.gen.dto.Message();
    msg.fromJSON({
      'type': help.message.Type.INTRO,
      'index': 0,
      'location': ''
    });
    this.handleMessageInternal(msg);
  }

  /** @protected */
  handleMessageInternal(msg) {
    switch (msg.type) {
      case help.message.Type.LOCATION:
        break;
      case help.message.Type.INTRO:
        break;
      case help.message.Type.INDEX:
        break;
      default: throw new Error(`Unknown message type: ${msg.type}`);
    }
  }

  /**
   * @param {goog.events.Event} e
   * @private
   */
  handleMessage_(e) {
    var msg = new app.gen.dto.Message();
    msg.fromJSON(goog.json.parse(e.getBrowserEvent()['data']));
    this.handleMessageInternal(msg);
    // var message = e.getBrowserEvent()['data'];
    // if (message == help.message.INTRO) {
    //   var node =
    //       goog.dom.safeHtmlToNode(help.template.Introduction().toSafeHtml());
    //   this.main_.getElement().appendChild(node);
    // }
  }
};
goog.addSingletonGetter(help.service.Viz);
