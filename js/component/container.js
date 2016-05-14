goog.provide('help.component.Container');
goog.provide('help.component.ContainerRenderer');

goog.require('pstj.material.Element');
goog.require('help.template');

help.component.Container = goog.defineClass(pstj.material.Element, {
  constructor: function() {
    pstj.material.Element.call(this);
    /**
     * On init the container should be partially hidden.
     * @private {!boolean}
     */
    this.isPartiallyHidden_ = true;
  }
  // It should be able to react to resize. It should take 80% of the page width
  // It should be able to have state - when it is fully visible and when it is
  // not fully visible (i.e. partially hidden)
});


/** Renderer for the container. */
help.component.ContainerRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getTemplate: function() {
    return help.template.HelpContainer(null);
  },

  /** @override */
  getCssClass: function() {
    return help.component.ContainerRenderer.CSS_CLASS;
  },

  statics: {
    /** @const {!string} */
    CSS_CLASS: goog.getCssName('help-container')
  }
});

