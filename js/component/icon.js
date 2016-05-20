goog.provide('help.component.Icon');
goog.provide('help.component.IconRenderer');

goog.require('goog.asserts');
goog.require('goog.color');
goog.require('goog.ui.registry');
goog.require('help.template');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');

/** @typedef {{color: !string}} */
help.component.IconTemplateSettings;

/** Imlements a simple icon, we can do with it much more... */
help.component.Icon = goog.defineClass(pstj.material.Element, {
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
    /** @private {{hex: string, type: string}} */
    this.color_ = goog.color.parse('white');
  },

  /**
   * Sets the color to be used by the icon.
   * @param {string} color The new color to use.
   */
  setColor: function(color) { this.color_ = goog.color.parse(color); },

  /**
   * Getter for the currently used color.
   * @return {string}
   */
  getColor: function() { return this.color_.hex; }
});

/** Imlements the controller renderer */
help.component.IconRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() { pstj.material.ElementRenderer.call(this); },

  /** @override */
  getTemplate: function(model) { return help.template.HelpIcon(model); },

  /** @override */
  generateTemplateData: function(icon) {
    goog.asserts.assertInstanceof(icon, help.component.Icon);
    return {color: icon.getColor()};
  },

  /** @override */
  getCssClass: function() { return help.component.IconRenderer.CSS_CLASS; },

  statics: {
    /** @const {string} */
    CSS_CLASS: goog.getCssName('help-icon')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(
    help.component.Icon, help.component.IconRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    help.component.IconRenderer.CSS_CLASS,
    function() { return new help.component.Icon(null); });
