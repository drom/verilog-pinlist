'use strict';

const simplify = require('./simplify.js');
const minusValue = require('./minus-value.js');

module.exports = source => {
  const l1 = source.match(/[^\r\n]+/g);
  const l2 = l1.reduce((res, line) => {

    const m2 = line.match(/^\s*(input|output)\s+(wire)\s+\[(.+):(.+)\]\s+(\w+)/);
    if (m2) {
      const left = simplify(m2[3]);
      const right = simplify(m2[4]);
      const width = simplify(left + '-' + right + '+1');
      res[m2[5]] = (m2[1] === 'input') ? width : minusValue(width);
      return res;
    }

    const m4 = line.match(/^\s*(input|output)\s+\[(.+):(.+)\]\s+(\w+)/);
    if (m4) {
      const left = simplify(m4[2]);
      const right = simplify(m4[3]);
      const width = simplify(left + '-' + right + '+1');
      res[m4[4]] = (m4[1] === 'input') ? width : minusValue(width);
      return res;
    }

    const m1 = line.match(/^\s*(input|output)\s+(wire)\s+(\w+).+/);
    if (m1) {
      res[m1[3]] = (m1[1] === 'input') ? 1 : -1;
      return res;
    }

    const m3 = line.match(/^\s*(input|output)\s+(\w+).+/);
    if (m3) {
      res[m3[2]] = (m3[1] === 'input') ? 1 : -1;
      return res;
    }

    return res;
  }, {});
  return l2;
  // console.log(l2);
};
