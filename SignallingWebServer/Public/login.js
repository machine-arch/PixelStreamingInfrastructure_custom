!(function (e, o) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = {})
    : 'function' == typeof define && define.amd
    ? define([], o)
    : 'object' == typeof exports
    ? (exports['epicgames-frontend'] = {})
    : (e['epicgames-frontend'] = {});
})(this, () => ({}));
