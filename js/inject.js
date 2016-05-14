/**
 * @fileoverview Provides the main entry point for our app that will be injected
 * in the angular app container.
 */
goog.provide('inject');

goog.require('help.component.IconContainer');

var cnt = new help.component.IconContainer();
cnt.render(document.body);
