/**
 * @fileoverview Generic entry point for your application. Require your actual
 * application namespace from here and instancite it accordingly.
 *
 * Note that no assumptions are made about your application. However if you
 * want to go with module system and loading indication - those are not
 * handled automatically and you need to use corresponding utilities.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('app');

goog.require('goog.debug.Console');
goog.require('help.control.HelpViewer');

if (goog.DEBUG) {
  (new goog.debug.Console()).setCapturing(true);
}

help.control.HelpViewer.getInstance().init();
