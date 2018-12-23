'use strict';

const Parser = require('tree-sitter');
const verilog = require('tree-sitter-verilog');

const traverse = cb => {
  const enter = cb.enter;
  const leave = cb.leave;

  const rec = node => {
    const childCount = node.childCount;
    enter(node);
    for (let i = 0; i < childCount; i++) {
      rec(node.child(i));
    }
    leave(node);
  };

  return rec;
};

const pinlist = root => {
  let res = {};
  let input = false;
  traverse({
    enter: (node) => {
      console.log('->', node.type);
      switch (node.type) {
      case 'input_declaration': input = true; break;
      case 'simple_identifier': if (input) res[node.text] = 1; break;
      }
    },
    leave: (node) => {
      console.log('<-', node.type);
      switch (node.type) {
      case 'input_declaration': input = false; break;
      }
    }
  })(root);
  return res;
};

module.exports = () => {
  const parser = new Parser();
  parser.setLanguage(verilog);
  return source => {
    const tree = parser.parse(source);
    return pinlist(tree.rootNode);
  };
};
