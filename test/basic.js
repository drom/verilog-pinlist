'use strict';

const lib = require('../lib/index.js');
const expect = require('chai').expect;

const pl = lib();

describe('v95', () => {

  it('simple', () => {
    expect(pl(`
\`line 10 "bar" 42
module foo (clk, wdata, valid, rdata);
  input clk;
  input wire [31:0] wdata;
  output valid;
  input foo, bar;
  input wire [15:0] wdata0, wdata1;
  output baz, qux;
  output [DWIDTH-1:0] rdata;

endmodule
    `)).deep.eq({
      foo: {
        type: 'module',
        ports: {
          clk: 1,
          foo: 1,
          bar: 1,
          baz: -1,
          qux: -1,
          rdata: '-(DWIDTH)',
          valid: -1,
          wdata: 32,
          wdata0: 16,
          wdata1: 16
        }
      }
    });
  });

});

describe('ansi', () => {

  it('simple', () => {
    expect(pl(`
module bar (
  input clk,
  input [31:0] wdata,
  output valid,
  output reg [DWIDTH-1:0] rdata
);

endmodule
    `)).deep.eq({
      bar: {
        type: 'module',
        ports: {
          clk: 1,
          rdata: '-(DWIDTH)',
          valid: -1,
          wdata: 32
        }
      }
    });
  });

});

/* eslint-env mocha */
