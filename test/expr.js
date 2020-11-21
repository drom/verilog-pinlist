'use strict';

const expr = require('../lib/expr.js');
const expect = require('chai').expect;

const expParse = expr();

const tests = {
  '42':             {type: 'number', base: 10, raw: '42'},
  '8\'d99':         {type: 'number', base: 10, raw: '8\'d99'},
  '10\'b010101':    {type: 'number', base: 2,  raw: '10\'b010101'},
  '256\'Haba_F12':  {type: 'number', base: 16, raw: '256\'Haba_F12'},
  'foo':            {type: 'identifier', name: 'foo'},
  'barr & baz | ^haha': {
    type: 'binary_expression', operator: '|',
    left: {
      type: 'binary_expression', operator: '&',
      left: {type: 'identifier', name: 'barr'},
      right: {type: 'identifier', name: 'baz'}
    },
    right: {
      type: 'unary_expression', operator: '^',
      argument: {type: 'identifier', name: 'haha'}
    }
  },
  '-(8 * W)': {
    type: 'unary_expression', operator: '-',
    argument: {
      type: 'binary_expression', operator: '*',
      left: {type: 'number', base: 10, raw: '8'},
      right: {type: 'identifier', name: 'W'}
    }
  }
};

describe('expr', () => {
  for (let key of Object.keys(tests)) {
    it(key, () => {
      expect(expParse(key)).to.deep.eq(tests[key]);
    });
  }
});

/* eslint-env mocha */
