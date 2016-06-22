goog.provide('help.service.Highlighter');

goog.require('pstj.control.Control');
goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('pstj.lab.style.css');
goog.require('goog.dom');
goog.require('goog.style');

/** Implements our class */
help.service.Highlighter = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /** @private {Array<Element>} */
    this.elements_ = [];
    /** @private {Array<string>} */
    this.originalStyles_ = [];
    /** @private {Array<Element>} */
    this.badges_ = [];
  },

  /** @private */
  findElements_: function() {
    this.cleanUp();
    goog.array.forEach(
        document.querySelectorAll(help.service.Highlighter.Selector),
        this.addElement, this);
  },

  /**
   * Enable / disable the elements.
   * @param {boolean} enable
   */
  setEnabled: function(enable) {
    if (enable) {
      this.findElements_();
    } else {
      this.cleanUp();
    }
  },

  /**
   * Adds new element.
   * @protected
   * @param {Element} el
   * @param {number} index
   */
  addElement: function(el, index) {
    this.elements_.push(el);
    this.saveOriginalStyle(el, index, null);
    this.addCustomStyle(el, index, null);
    this.addBadge(el, index, null);
  },

  /**
   * Remove references.
   * @protected
   */
  cleanUp: function() {
    goog.array.forEach(this.elements_, this.restoreOriginalStyle, this);
    goog.array.forEach(this.badges_, goog.dom.removeNode);
    goog.array.clear(this.badges_);
    goog.array.clear(this.originalStyles_);
    goog.array.clear(this.elements_);
  },

  /**
   * @protected
   * @param {Element} el
   * @param {number} index
   * @param {Array<Element>} list
   */
  saveOriginalStyle: function(el, index, list) {
    // this.originalStyles_.push(style.getStyle(el, Property));
  },

  /**
   * @protected
   * @param {Element} el
   * @param {number} index
   * @param {Array<Element>} list
   */
  addCustomStyle: function(el, index, list) {
    goog.dom.classlist.add(el, help.service.Highlighter.ClassName);
  },

  /**
   * @protected
   * @param {Element} el
   * @param {number} index
   * @param {Array<Element>} list
   */
  addBadge: function(el, index, list) {
    var div = goog.dom.createDom(
        'div', goog.getCssName('help-item-badge'), (index + 1).toString());
    var coor = goog.style.getPageOffset(el);
    goog.style.setStyle(
        div,
        {'position': 'absolute', 'top': `${coor.y}px`, 'left': `${coor.x}px`});
    pstj.lab.style.css.setTranslation(div, -100, 0, '%');
    document.body.appendChild(div);
    this.badges_.push(div);
  },

  /**
   * @protected
   * @param {Element} el
   * @param {number} index
   * @param {Array<Element>} list
   */
  restoreOriginalStyle: function(el, index, list) {
    goog.dom.classlist.remove(el, help.service.Highlighter.ClassName);
    // styles.setStyle(el, Property, this.originalStyles_[index] || '');
  },

  statics: {
    /** @const {string} */
    Selector: '[data-intro]',

    /** @const {string} */
    ClassName: goog.getCssName('help-item-exposed')
  }
});
goog.addSingletonGetter(help.service.Highlighter);
