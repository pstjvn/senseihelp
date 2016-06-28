goog.provide('help.control.HelpViewer');

goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.json');
goog.require('help.component.Main');
goog.require('help.message');
goog.require('help.loader');
goog.require('help.parser');
goog.require('help.template');
goog.require('pstj.control.Control');
goog.require('app.gen.dto.Message');

help.control.HelpViewer = class extends pstj.control.Control {
  constructor() {
    super();
    /** @private {?help.parser.Result} */
    this.help_ = null;
    this.voidNode_ = goog.dom.safeHtmlToNode(help.template.NotAvailable().toSafeHtml());
    this.main_ = new help.component.Main();
    this.main_.render(document.body);
  }

  /** @override */
  init() {
    super.init();
    this.getHandler().listen(
        window, goog.events.EventType.MESSAGE, this.handleMessage_);
  }

  /**
   * @protected
   * @param {!Array<!string>} lines
   * @param {number} index
   * @return {Node}
   */
  makeNode(lines, index) {
    return goog.dom.safeHtmlToNode(help.template.Item({
      lines: lines,
      index: index
    }).toSafeHtml());
  }

  /**
   * @protected
   * @param {!Array<!string>} lines
   * @return {Node}
   */
  makeIntroNode(lines) {
    return goog.dom.safeHtmlToNode(help.template.Main({
      lines: lines
    }).toSafeHtml());
  }

  /**
   * @param {app.gen.dto.Message} msg
   * @protected
   */
  handleMessageInternal(msg) {
    console.log('Received message over bridge', msg.type);
    switch (msg.type) {

      // When chaning the location we should load the new file if possible.
      case help.message.Type.LOCATION:
        this.help_ = null;
        console.log('Requested change of location');

        help.loader.load(msg.url).then(function(result) {
          return help.parser.parse(result)
        }, null, this).then(function(result) {
          console.log('Parsed help', result);
          this.help_ = result;
        }, function(err) {
          console.log('Did not found help file, will not show help for this...');
        }, this);
        break;

      // When we need to show help for the first time.
      case help.message.Type.FIRSTTIME:

        var node = goog.dom.safeHtmlToNode(help.template.Introduction().toSafeHtml());
        this.main_.setContent(node);
        break;

      // When we need to find indexed help.
      case help.message.Type.INDEX:
        console.log('Requested show of indexed help', msg.helpIndex);
        if (this.help_) {
          this.main_.setContent(this.makeNode(this.help_.items[msg.helpIndex], msg.helpIndex));
        } else {
          this.main_.setContent(this.voidNode_);
        }
        break;

      // When we need to show the intro help for the page.
      case help.message.Type.INTRO:
        if (this.help_) {
          this.main_.setContent(this.makeIntroNode(this.help_.main));
        } else {
          this.main_.setContent(this.voidNode_);
        }
        break;

      // Did we receive a type we do not know how to handle?
      default: throw new Error(`Unknown message type: ${msg.type}`);
    }
  }

  /**
   * @param {goog.events.Event} e
   * @private
   */
  handleMessage_(e) {
    console.log('Recevined new message from bridge');
    var msg = new app.gen.dto.Message();
    msg.fromJSON(goog.json.parse(e.getBrowserEvent()['data']));
    this.handleMessageInternal(msg);
  }
};
goog.addSingletonGetter(help.control.HelpViewer);
