#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const JSON5 = require('json5');
const concat = require('concat-stream');

const lib = require('../lib/index.js');

const argv = yargs
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .version()
  .help()
  .argv;

const pinlister = lib();

function gotInput (source) {
  const pins = pinlister(source);
  console.log(JSON5.stringify(pins, null, 2));
}

const concatStream = concat(gotInput);

let source;

// if (process.stdin.isTTY) {
source = process.stdin.setEncoding('ascii');
// }

if (source) {
  source.pipe(concatStream);
} else {
  yargs.showHelp();
}
