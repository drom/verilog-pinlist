'use strict';

const request = require('request');
const chai = require('chai');

const lib = require('../lib/index.js');

const expect = chai.expect;

const pl = lib();

const links = {
  'https://raw.githubusercontent.com/aolofsson/oh/master/axi/hdl/emaxi.v': {emaxi: 49},
  'https://raw.githubusercontent.com/aolofsson/oh/master/edma/hdl/edma.v': {edma: 17},
  'https://raw.githubusercontent.com/aolofsson/oh/master/spi/hdl/axi_spi.v': {axi_spi: 50},
  'https://raw.githubusercontent.com/analogdevicesinc/hdl/master/library/axi_ad9963/axi_ad9963.v': {axi_ad9963: 51},
  'https://raw.githubusercontent.com/analogdevicesinc/hdl/master/library/axi_ad9963/axi_ad9963_rx.v': {axi_ad9963_rx: 29},
};

describe('online', function () {
  this.timeout(10000);
  Object.keys(links).forEach((link, i) => {
    it('l' + i, done => {
      request(link, (error, response, body) => {
        const res = pl(body);
        const count = Object.keys(res).reduce((prev, mod) => {
          prev[mod] = Object.keys(res[mod].ports).length;
          return prev;
        }, {});
        try{
          expect(count).to.deep.eq(links[link]);
        } catch (e) {
          console.log(res);
          throw e;
        }
        done();
      });
    });
  });
});

/* eslint-env mocha */
