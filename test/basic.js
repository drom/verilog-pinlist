'use strict';

const lib = require('../lib/index.js');
const expect = require('chai').expect;

const pl = lib();

describe('v95', () => {

  it('input 1', () => {
    expect(pl(`
module mod (a);
  input a, b;
  output c, d, e;
  input [31:0] f, g;
  output [W-1:0] h, k;
  inout llll;
  output [D1-1:0] mm, nnn;

endmodule
    `)).deep.eq({
      a: 1, b: 1,
      c: -1, d: -1, e: -1,
      f: 32, g: 32,
      h: '-(W)', k: '-(W)',
      llll: {direction: 'inout', width: undefined},
      mm: '-(D1)', nnn: '-(D1)'
    });
  });

});

describe('ansi', () => {

  it('input 1', () => {
    expect(pl(`
module mod #(

)(
  input a, b,
  output c, d, e,
  input [31:0] f, g
);

endmodule
    `)).deep.eq({
      a: 1, b: 1,
      c: -1, d: -1, e: -1,
      f: 32, g: 32
    });
  });

});

/* eslint-env mocha */
