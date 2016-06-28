goog.provide('help.parser');

goog.require('goog.array');
goog.require('goog.string');

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

/**
 * Parses the text given.
 * @param  {!string} txt The text to parse to html.
 * @return {!help.parser.Result}     The parsed html.
 */
help.parser.parse = function(txt) {
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
