'use strict';

const Parser = require('tree-sitter');
const verilog = require('tree-sitter-verilog');

const simplify = require('./simplify.js');
const traverse = require('./traverse.js');
const minusValue = require('./minus-value.js');


const getWidth = (node, pin) => {
  const left  = simplify(node.child(0).text);
  const right = simplify(node.child(2).text);
  const width = simplify(left + '-' + right + '+1');
  pin.range = [left, right];
  pin.width = width;
};


const pinlist = root => {
  let res = [];
  let pin = {};

  // let indentCount = 0;
  //
  // const indent = tag => {
  //   console.log(' '.repeat(indentCount) + '(' + tag);
  //   indentCount += 2;
  // };
  //
  // const unindent = () => {
  //   indentCount -= 2;
  //   console.log(' '.repeat(indentCount) + ')');
  // };

  traverse({
    enter: (node) => {
      // indent(node.type);
      switch (node.type) {
      case 'input_declaration':
      case 'input':
        pin = {direction: 'input'};
        res.push(pin);
        break;
      case 'output_declaration':
      case 'output':
        pin = {direction: 'output'};
        res.push(pin);
        break;
      case 'inout_declaration':
        pin = {direction: 'inout'};
        res.push(pin);
        break;
      case 'constant_range':
        if (pin.direction) {
          getWidth(node, pin);
          if (pin.range[1] !== 0) {
            throw new Error(
              'range started not from 0 but ' + pin.range[1] +
              ' pin:' + JSON.stringify(pin)
            );
          }
        }
        break;

      case 'simple_identifier':
        pin.name = node.text;
        break;
      }
    },
    leave: (node) => {
      // unindent();
      switch (node.type) {
      case 'input_declaration':
      case 'output_declaration':
      case 'inout_declaration':
      case 'ansi_port_declaration':
        pin = {};
        break;
      }
    }
  })(root);

  // return res;
  return res.reduce((acc, pin) => {
    switch(pin.direction) {
    case 'input':
      acc[pin.name] = pin.width || 1;
      break;
    case 'output':
      acc[pin.name] = minusValue(pin.width || 1);
      break;
    case 'inout':
      acc[pin.name] = {
        direction: pin.direction,
        width: pin.width
      };
    }
    return acc;
  }, {});
};

module.exports = () => {
  const parser = new Parser();
  parser.setLanguage(verilog);
  return source => {
    const tree = parser.parse(source);
    const pl = pinlist(tree.rootNode);
    // console.log(JSON.stringify(pl, null, 2));
    return pl;
  };
};
