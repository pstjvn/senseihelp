goog.provide('help.component.Button');
goog.provide('help.component.ButtonRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.app.UiControl');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');

/** A very simple button */
help.component.Button = goog.defineClass(pstj.app.UiControl, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
    this.setUsePointerAgent(true);
  },

  /** @override */
  onTap: function(e) {
    this.getController().push(help.topic.HIDE, undefined);
  }
});

/** The renderer */
help.component.ButtonRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  statics: {
    /** @const {string} */
    CSS_CLASS: goog.getCssName('help-button')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(
    help.component.Button, help.component.ButtonRenderer);

// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    help.component.ButtonRenderer.CSS_CLASS,
    function() { return new help.component.Button(null); });
