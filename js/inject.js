/**
 * @fileoverview Provides the main entry point for our app that will be injected
 * in the angular app container.
 */
goog.provide('inject');

// goog.require('help.service.Help');
goog.require('help.control.Help');
// goog.require('pstj.storage.Storage');

// var hs = new help.service.Help();

// goog.exportSymbol('closure.help.showIcon', function() {
//   var cnt = new help.component.IconContainer();
//   cnt.render(document.body);
// });

// goog.exportSymbol('closure.help.activateButtonIfNeeded', function() {
//   var storage = pstj.storage.Storage.getInstance();
//   var lastUserId = storage.get('lastUserId');
//   if (goog.isDefAndNotNull(lastUserId)) {
//     var userHasSeenIt = storage.get('_hasSeenIt_' + lastUserId);
//     if (!userHasSeenIt) {
//       goog.global['closure']['help']['showIcon']();
//     }
//   }
// });


help.control.Help.getInstance().init();

if (goog.DEBUG) {
  // hs.showIcon();
}

goog.exportSymbol('help.changeViewLocation', function(link) {
  console.log('Change the loaded help file', link);
});
// goog.exportSymbol('help.init', function(url) { hs.showIcon(); });

// goog.exportSymbol('help.activate', function() {
//   // Read the current URL
//   // Load relevant docs
//   // Show header of those docs.
//   hs.activateForUrl('a');
// });
