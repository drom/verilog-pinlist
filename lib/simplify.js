'use strict';

const mathjs = require('mathjs');

module.exports = expr => {
  const node = mathjs.simplify(expr);
  if (node.value !== undefined) {
    return node.value;
  }
  return node.toString();
};
