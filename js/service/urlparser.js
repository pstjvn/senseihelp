goog.provide('help.service.url');

/**
 * Given an url as passed down from angular application converts it to
 * a filename which will be matched to download from the srver.
 *
 * This method is extracted as to allow the hosting of the help files in
 * an independent way (for example gdrive etc).
 *
 * @param  {string} url
 * @return {string}
 */
help.service.url.parse = function(url) {
  return url;
};
