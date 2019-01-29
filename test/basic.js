'use strict';

const lib = require('../lib/index.js');
const expect = require('chai').expect;

const pl = lib();

describe('v95', () => {

  it('simple', () => {
    expect(pl(`
module mod (clk, wdata, valid, rdata);
  input clk;
  input wire [31:0] wdata;
  output valid;
  output [DWIDTH-1:0] rdata;

endmodule
    `)).deep.eq({
      clk: 1,
      rdata: '-(DWIDTH)',
      valid: -1,
      wdata: 32,
      undefined: -1 // FIXME
    });
  });

});

describe('ansi', () => {

  it('simple', () => {
    expect(pl(`
module mod (
  input clk,
  input [31:0] wdata,
  output valid,
  output reg [DWIDTH-1:0] rdata
);

endmodule
    `)).deep.eq({
      clk: 1,
      rdata: '-(DWIDTH)',
      valid: -1,
      wdata: 32
    });
  });

});

/* eslint-env mocha */
