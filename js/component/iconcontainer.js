goog.provide('help.component.IconContainer');
goog.provide('help.component.IconContainerRenderer');

goog.require('goog.asserts');
goog.require('goog.math.Coordinate');
goog.require('goog.style');
goog.require('goog.ui.registry');
/** @suppress {extraRequire} */
goog.require('help.component.Icon');
goog.require('help.component.IconAnimation');
goog.require('help.data');
goog.require('help.template');
goog.require('help.topic');
goog.require('pstj.app.UiControl');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');

/** @define {string} The class name of the element we should hide in. */
goog.define('help.HIDE_TARGET_CLASS', 'help-hide-target');

/** The icon container, it will animate. */
help.component.IconContainer = goog.defineClass(pstj.app.UiControl, {
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
    /** @private {boolean} */
    this.hasBeenClicked_ = false;
    /**
     * Reference the complex animation that we expect to have on this component.
     * @private {!help.component.IconAnimation}
     * @final
     */
    this.animation_ = new help.component.IconAnimation();
    this.setUsePointerAgent(true);
    this.setHandleMouseEvents(true);
    this.setSupportedState(goog.ui.Component.State.HOVER, true);
    this.setAutoStates(goog.ui.Component.State.HOVER, true);
    this.setDispatchTransitionEvents(goog.ui.Component.State.HOVER, true);
  },

  /** @override */
  onTap: function(e) {
    if (!this.hasBeenClicked_) {
      this.hasBeenClicked_ = true;
      this.setHighlighted(false);
      this.getController().push(help.topic.SHOW_HELP_INTRO, undefined);
      this.goToTarget(
          goog.asserts.assert(
              /** @type {!Element} */ (
                  document.querySelector('.' + help.HIDE_TARGET_CLASS))));
    }
  },

  /**
   * Go to the pre-defined point. With animation.
   * @param {!Element} el The element to which to animation our control.
   * @param {boolean=} opt_dispose If we should dispse of the icon after the
   * animation.
   */
  goToTarget: function(el, opt_dispose) {
    if (opt_dispose) {
      this.getHandler().listenOnce(
          this.animation_, goog.fx.Transition.EventType.FINISH,
          function(e) { this.dispose(); });
    }
    this.animation_.setup(this.getElementStrict(), el);
    this.animation_.play();
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.getRenderer().applyDefaultPosition(this.getElementStrict());
  },

  /**
   * @override
   * @return {!help.component.IconContainerRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(
        goog.base(this, 'getRenderer'), help.component.IconContainerRenderer);
  }
});

/** The renderer for animating container. */
help.component.IconContainerRenderer =
    goog.defineClass(pstj.material.ElementRenderer, {
      constructor: function() {
        pstj.material.ElementRenderer.call(this);
        this.styleElement = null;
      },

      /** @param {!Element} el The element that is the one we need to style. */
      applyDefaultPosition: function(el) {
        goog.style.setStyle(el, {
          'position': 'fixed',
          'bottom': '10px',
          'right': '10px',
          'transformOrigin': '0 0',
          'z-index': help.data.Layer.HELP_ICON
        });
      },

      /** @override */
      getTemplate: function(model) {
        return help.template.IconContainer(null);
      },

      /** @override */
      getCssClass: function() {
        return help.component.IconContainerRenderer.CSS_CLASS;
      },

      statics: {
        /** @const {string} */
        CSS_CLASS: goog.getCssName('help-icon-container')
      }
    });

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(
    help.component.IconContainer, help.component.IconContainerRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    help.component.IconContainerRenderer.CSS_CLASS,
    function() { return new help.component.IconContainer(null); });
