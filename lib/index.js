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

const getPinValue = pin => {
  switch(pin.direction) {
  case 'input':
    return pin.width || 1;
  case 'output':
    return minusValue(pin.width || 1);
  case 'inout':
    return {
      direction: pin.direction,
      width: pin.width
    };
  }
};


const pinlist = root => {
  let src = {};
  let ports = {};
  let pin = {};
  let insidePortDecalaration = false;

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
      let mod;
      // indent(node.type);
      switch (node.type) {
      case 'module_header':
        ports = {};
        mod = {};
        mod[node.child(1).text] = {
          type: node.child(0).text,
          ports: ports
        };
        src = Object.assign(src, mod);
        break;
      case 'port_declaration':
      case 'ansi_port_declaration':
        insidePortDecalaration = true;
        break;
      }
      if (insidePortDecalaration) {
        switch (node.type) {
        case 'input_declaration':   pin = {direction: 'input'}; break;
        case 'output_declaration':  pin = {direction: 'output'}; break;
        case 'inout_declaration':   pin = {direction: 'inout'}; break;
        case 'port_direction':      pin = {direction: node.text}; break;
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

        case 'port_identifier':
        case 'variable_identifier':
          ports[node.text] = getPinValue(pin);
          break;
        }

      }
    },
    leave: (node) => {
      // unindent();
      switch (node.type) {
      case 'ansi_port_declaration':
      case 'port_declaration':
        insidePortDecalaration = false;
        break;
      }
    }
  })(root);

  return src;
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
