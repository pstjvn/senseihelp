goog.provide('help.component.Container');
goog.provide('help.component.ContainerRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('help.component.Button');
goog.require('help.template');
goog.require('pstj.app.UiControl');
goog.require('pstj.material.ElementRenderer');

/** The container */
help.component.Container = goog.defineClass(pstj.app.UiControl, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.app.UiControl.call(this, opt_content, opt_renderer, opt_domHelper);
    this.setSupportedState(goog.ui.Component.State.OPENED, true);
    this.setDispatchTransitionEvents(goog.ui.Component.State.OPENED, true);
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.setOpen(false);
    this.getRenderer().applyDefaultStyles(this.getElementStrict());
  },

  /**
   * @override
   * @return {!help.component.ContainerRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(
        goog.base(this, 'getRenderer'), help.component.ContainerRenderer);
  }
});


/** Renderer for the container. */
help.component.ContainerRenderer =
    goog.defineClass(pstj.material.ElementRenderer, {
      constructor: function() { pstj.material.ElementRenderer.call(this); },

      /** @override */
      getTemplate: function() { return help.template.Container(null); },

      /** @override */
      getCssClass: function() {
        return help.component.ContainerRenderer.CSS_CLASS;
      },

      /**
       * @param {Element} el
       */
      applyDefaultStyles: function(el) {
        goog.style.setStyle(el, {
          'position': 'fixed',
          'width': '80%',
          'height': '140px',
          'bottom': '0',
          'left': '50%',
        });
      },

      /** @override */
      getContentElement: function(el) {
        return this.querySelector(
            el, '.' + goog.getCssName(this.getCssClass(), 'inner'));
      },

      statics: {
        /** @const {!string} */
        CSS_CLASS: goog.getCssName('help-container')
      }
    });


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(
    help.component.Container, help.component.ContainerRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    help.component.ContainerRenderer.CSS_CLASS,
    function() { return new help.component.Container(null); });
