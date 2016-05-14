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

goog.require('goog.dom');
goog.require('help.loader');
goog.require('help.parser');
goog.require('help.template');


(function() {
  document.body.appendChild(
      goog.dom.safeHtmlToNode(help.template.Container(null).toSafeHtml()));
  // Instanciate your app code here.
  help.loader.load('assets/example.txt')
      .then(function(text) {
        // var res = `<div href="_1">${html}</div><div href="_2">${html}</div><div href="_3">${html}</div>`;
        document.querySelector('.help-container-inner').appendChild(
            goog.dom.safeHtmlToNode(
                help.template.Content(help.parser.parse(text)).toSafeHtml()));
      });
      // .then(function(html) {
      //   console.log(html)
      // });
})();
