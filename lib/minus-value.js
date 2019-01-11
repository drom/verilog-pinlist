'use strict';

module.exports = function (val) {
  if (typeof val === 'number') {
    return -val;
  }
  if (typeof val === 'string') {
    return '-(' + val + ')';
  }
  throw new Error(typeof val);
};
