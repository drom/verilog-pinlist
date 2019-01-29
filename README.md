[![NPM version](https://img.shields.io/npm/v/pinlist.svg)](https://www.npmjs.org/package/pinlist)
[![Travis ](https://travis-ci.org/drom/verilog-pinlist.svg?branch=master)](https://travis-ci.org/drom/verilog-pinlist)

Extract pinlist from Verilog files.

## Install

```sh
npm i pinlist
```

## Library usage

```js
const pinlist = require('pinlist');

const pl = pinlist(); // instance of pinlist extractor tool

const pinst = pl(`

  module mod (
    input clk,
    input [31:0] wdata,
    output valid,
    output reg [DWIDTH-1:0] rdata
  );

  endmodule

`);
// {
//   clk: 1,
//   rdata: '-(DWIDTH)',
//   valid: -1,
//   wdata: 32
// }

```

## CLI Usage

```sh
cat top.v | pinlist > alpha.json5
```
