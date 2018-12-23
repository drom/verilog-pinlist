'use strict';

const lib = require('../lib/index.js');
const expect = require('chai').expect;

const pl = lib();

describe('v95', () => {

  it('input 1', () => {
    expect(pl(`
module mod (a);
  input a;
endmodule
    `)).deep.eq({a: 1});
  });

});

describe('ansi', () => {

  it('input 1', () => {
    expect(pl(`
module mod (
  input a
);

endmodule
    `)).deep.eq({a: 1});
  });

});

/* eslint-env mocha */
