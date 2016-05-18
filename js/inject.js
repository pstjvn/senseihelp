/**
 * @fileoverview Provides the main entry point for our app that will be injected
 * in the angular app container.
 */
goog.provide('inject');

goog.require('help.component.IconContainer');
goog.require('help.service.Help');
goog.require('pstj.storage.Storage');

var hs = new help.service.Help();

goog.exportSymbol('closure.help.showIcon', function() {
  var cnt = new help.component.IconContainer();
  cnt.render(document.body);
});

goog.exportSymbol('closure.help.activateButtonIfNeeded', function() {
  var storage = pstj.storage.Storage.getInstance();
  var lastUserId = storage.get('lastUserId');
  if (goog.isDefAndNotNull(lastUserId)) {
    var userHasSeenIt = storage.get('_hasSeenIt_' + lastUserId);
    if (!userHasSeenIt) {
      goog.global['closure']['help']['showIcon']();
    }
  }
});

if (goog.DEBUG) {
  var cnt = new help.component.IconContainer();
  cnt.render(document.body);
}
