/**
 * @fileoverview Provides the main entry point for our app that will be injected
 * in the angular app container.
 */
goog.provide('inject');

goog.require('goog.debug.Console');
goog.require('help.control.Help');
goog.require('help.topic');

if (goog.DEBUG) {
  (new goog.debug.Console()).setCapturing(true);
}

help.control.Help.getInstance().init();

goog.exportSymbol('help.changeLocation', function(link) {
  help.control.Help.getInstance().push(help.topic.LOCATION, String(link));
});

goog.exportSymbol('help.showFirstTime', function() {
  help.control.Help.getInstance().push(help.topic.FIRST_TIME, undefined);
});

goog.exportSymbol('help.activate', function() {
  help.control.Help.getInstance().push(help.topic.SHOW_HELP_INTRO, undefined);
});

goog.exportSymbol('help.deactivate', function() {
  help.control.Help.getInstance().push(help.topic.HIDE, undefined);
});
