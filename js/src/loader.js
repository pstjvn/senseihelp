goog.provide('help.loader');

goog.require('goog.labs.net.xhr');
goog.require('help.service.url');

/**
 * Simple wrapper around the getter. We do this because we might want to use
 * local FS to speed things up in the future.
 *
 * @param  {!string} url The URL to download
 * @param  {goog.labs.net.xhr.Options=} opt_config The optional headers and
 *                                                 other data.
 * @return {!goog.Promise<string>} The downloaded content
 */
help.loader.load = function(url, opt_config) {
  return goog.labs.net.xhr.get(help.service.url.parse(url), opt_config);
};
