#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');

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
    console.log(source);
    console.log(pinlister(source));
  });

})(argv._);
// console.log(pinlister(source));
