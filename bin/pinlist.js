#!/usr/bin/env node
'use strict';

const path = require('path');
const util = require('util');

const fs = require('fs-extra');
const JSON5 = require('json5');
const yargs = require('yargs');

const lib = require('../lib/index.js');

const readFile = util.promisify(fs.readFile);

const pinlister = lib();

const argv = yargs
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .help()
  .argv;

(async (files) => {

  files.map(async file => {
    const pat = path.resolve(process.cwd(), file);
    const source = await readFile(pat, 'utf-8');
    // console.log(source);
    const pins = pinlister(source);
    console.log(JSON5.stringify(pins, null, 2));
  });

})(argv._);
// console.log(pinlister(source));
