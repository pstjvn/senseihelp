goog.provide('help.component.Main');
goog.provide('help.component.MainRenderer');

goog.require('goog.log.Logger');
goog.require('goog.ui.registry');
goog.require('help.template');
goog.require('pstj.app.UiControl');
goog.require('pstj.material.ElementRenderer');

/** The main view component */
help.component.Main = class extends pstj.app.UiControl {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor(opt_content, opt_renderer, opt_domHelper) {
    super(opt_content, opt_renderer, opt_domHelper);
  }
};

/** @protected {goog.debug.Logger} */
help.component.Main.prototype.logger =
    goog.log.getLogger('help.component.Main');

/** The renderer */
help.component.MainRenderer = class extends pstj.material.ElementRenderer {
  constructor() { super(); }

  /** @override */
  getTemplate() { return help.template.MainWrapper(null); }

  /** @override */
  getCssClass() {
    console.log('Code is...', help.component.MainRenderer.CSS_CLASS);
    return help.component.MainRenderer.CSS_CLASS;
  }
};

/** @const {string} */
help.component.MainRenderer.CSS_CLASS = goog.getCssName('help-main-wrapper');

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(
    help.component.Main, help.component.MainRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    help.component.MainRenderer.CSS_CLASS,
    function() { return new help.component.Main(null); });
