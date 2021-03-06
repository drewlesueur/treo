var type = require('component-type');

/**
 * Link to `IDBKeyRange`.
 */

var IDBKeyRange = window.IDBKeyRange
  || window.webkitIDBKeyRange
  || window.msIDBKeyRange;

/**
 * Expose `parseRange()`.
 */

module.exports = parseRange;

/**
 * Parse key to valid range.
 * https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange
 *
 * Available options (inspired by mongodb):
 *   gt: - greater
 *   lt: - lighter
 *   gte: - greater equal
 *   lte: - lighter equal
 *
 * @param {Object|Any} key
 * @return {IDBKeyRange}
 */

function parseRange(key) {
  if (!key) return;
  if (key instanceof IDBKeyRange) return key;
  if (type(key) != 'object') return IDBKeyRange.only(key);
  var keys = Object.keys(key).sort();

  if (keys.length == 1) {
    var val = key[keys[0]];
    switch (keys[0]) {
      case 'gt':  return IDBKeyRange.lowerBound(val, true);
      case 'lt':  return IDBKeyRange.upperBound(val, true);
      case 'gte': return IDBKeyRange.lowerBound(val);
      case 'lte': return IDBKeyRange.upperBound(val);
    }
  } else {
    var x = key[keys[0]];
    var y = key[keys[1]];

    switch (keys[0] + '-' + keys[1]) {
      case 'gt-lt':   return IDBKeyRange.bound(x, y, true, true);
      case 'gt-lte':  return IDBKeyRange.bound(x, y, true, false);
      case 'gte-lt':  return IDBKeyRange.bound(x, y, false, true);
      case 'gte-lte': return IDBKeyRange.bound(x, y, false, false);
    }
  }
}
