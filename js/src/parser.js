goog.provide('help.parser');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.log');

/**
 * The RegExps used in the parser.
 * @enum {!RegExp}
 */
help.parser.RegularExpression = {
  COMMON: /^[^#]*/g,
  ITEM: /\#[^\#]+/g
};

/**
 * The result that the parser will return.
 *
 * @typedef {{
 *   main: !Array<!string>,
 *   items: !Array<!Array<!string>>
 * }}
 */
help.parser.Result;

/** @protected {goog.debug.Logger} */
help.parser.logger = goog.log.getLogger('help.parser');

/**
 * Parses the text given.
 * @param  {!string} txt The text to parse to html.
 * @return {!help.parser.Result}     The parsed html.
 */
help.parser.parse = function(txt) {
  help.parser.reset_();
  var intro = help.parser.RegularExpression.COMMON.exec(txt);
  var items = [];

  var introtext = goog.array.filter(intro[0].split('\n\n'), function(item) {
    return !goog.string.isEmptyOrWhitespace(item);
  });

  var match = null;
  while ((match = help.parser.RegularExpression.ITEM.exec(txt)) != null) {
    items.push(match[0]);
  }

  var strings = goog.array.map(items, function(item) {
    return item.replace('# ', '');
  });

  var helps = goog.array.map(strings, function(item) {
    var res = goog.array.filter(item.split('\n\n'), function(str) {
      return !goog.string.isEmptyOrWhitespace(str);
    });
    return res;
  });

  return {
    main: introtext,
    items: helps
  };
};

/**
 * Resets the regular expressions state so we can parse the same string more
 * than once.
 * @private
 */
help.parser.reset_ = function() {
  help.parser.RegularExpression.COMMON.lastIndex = 0;
  help.parser.RegularExpression.ITEM.lastIndex = 0;
};