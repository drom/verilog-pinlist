'use strict';

const Parser = require('tree-sitter');
const verilog = require('tree-sitter-verilog');

const getAST = node => {
  const children = [];
  for (let i = 0; i < node.childCount; i++) {
    children.push(getAST(node.child(i)));
  }
  switch (node.type) {
  case 'binary_number':     return {type: 'number', base: 2, raw: node.text};
  case 'decimal_number':
  case 'unsigned_number':   return {type: 'number', base: 10, raw: node.text};
  case 'hex_number':        return {type: 'number', base: 16, raw: node.text};

  case 'simple_identifier': return {type: 'identifier', name: node.text};

  case 'unary_operator':
    return {type: 'unary_expression', operator: children[0].type};

  case 'integral_number':
  case 'primary_literal':
  case 'primary':
    switch (node.childCount) {
    case 1: return children[0];
    case 3: return children[1]; // ( mintypmax_expression )
    }
    return {type: node.type, children};

  case 'mintypmax_expression':
    switch (node.childCount) {
    case 1:
      return children[0];
    }
    return {type: node.type, children};

  case 'expression':
    switch (node.childCount) {
    case 1:
      return children[0];
    case 2:
      return Object.assign(children[0], {argument: children[1]});
    case 3:
      return {
        type: 'binary_expression',
        operator: children[1].type,
        left: children[0],
        right: children[2]
      };
    }
    return {type: node.type, children};
  }
  return {type: node.type, children};
};

const parser = () => {
  const parser = new Parser();
  parser.setLanguage(verilog);
  return source => {
    const tree = parser.parse(
      'module mod ();\n' +
      'assign BaR = ' + source + ';\n' +
      'endmodule\n'
    );
    const ast = getAST(tree.rootNode.child(0).child(3).child(0).child(1).child(0).child(2));
    // const ast = getAST(tree.rootNode);
    return ast;
  };
};

module.exports = parser;
