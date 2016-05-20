goog.module('help.service.Highlighter');

var Control = goog.require('pstj.control.Control');
var array = goog.require('goog.array');
var style = goog.require('goog.style');
var classlist = goog.require('goog.dom.classlist');
var dom = goog.require('goog.dom');

/** @const {string} */
const Selector = '[data-intro]';

/** @const {string} */
const ClassName = goog.getCssName('help-item-exposed');

/** Implements our class */
const Highlighter = class extends Control {
  constructor() {
    super();
    /** @private {Array<Element>} */
    this.elements_ = [];
    /** @private {Array<string>} */
    this.originalStyles_ = [];
    /** @private {Array<Element>} */
    this.badges_ = [];
  }

  /** @private */
  findElements_() {
    this.cleanUp();
    array.forEach(document.querySelectorAll(Selector), this.addElement, this);
  }

  /**
   * Enable / disable the elements.
   * @param {boolean} enable
   */
  setEnabled(enable) {
    if (enable) {
      this.findElements_();
    } else {
      this.cleanUp();
    }
  }

  /**
   * Adds new element.
   * @protected
   * @param {Element} el
   * @param {number} index
   */
  addElement(el, index) {
    this.elements_.push(el);
    this.saveOriginalStyle(el, index, null);
    this.addCustomStyle(el, index, null);
    this.addBadge(el, index, null);
  }

  /**
   * Remove references.
   * @protected
   */
  cleanUp() {
    array.forEach(this.elements_, this.restoreOriginalStyle, this);
    array.forEach(this.badges_, dom.removeNode);
    array.clear(this.badges_);
    array.clear(this.originalStyles_);
    array.clear(this.elements_);
  }

  /**
   * @protected
   * @param {Element} el
   * @param {number} index
   * @param {Array<Element>} list
   */
  saveOriginalStyle(el, index, list) {
    // this.originalStyles_.push(style.getStyle(el, Property));
  }

  /**
   * @protected
   * @param {Element} el
   * @param {number} index
   * @param {Array<Element>} list
   */
  addCustomStyle(el, index, list) { classlist.add(el, ClassName); }

  /**
   * @protected
   * @param {Element} el
   * @param {number} index
   * @param {Array<Element>} list
   */
  addBadge(el, index, list) {
    var div = dom.createDom(
        'div', goog.getCssName('help-item-badge'), (index + 1).toString());
    var coor = goog.style.getPageOffset(el);
    style.setStyle(
        div,
        {'position': 'absolute', 'top': `${coor.y}px`, 'left': `${coor.x}px`});
    document.body.appendChild(div);
    this.badges_.push(div);
  }

  /**
   * @protected
   * @param {Element} el
   * @param {number} index
   * @param {Array<Element>} list
   */
  restoreOriginalStyle(el, index, list) {
    classlist.remove(el, ClassName);
    // styles.setStyle(el, Property, this.originalStyles_[index] || '');
  }
};

/**
 * Export the instance.
 * @type {!Highlighter}
 */
exports = (new Highlighter());
