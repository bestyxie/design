'use strict';

var assert = require('assert');
var design = require('../lib');

// describe('design', function () {
//   it('should have unit test!', function () {
//     assert(false, 'we expected this package author to add actual unit tests.');
//   });
// });

describe('Array',function(){
  describe('#indexOf',function(){
    it('should return -1 when the value is not present',function(){
      assert.equal(-1,[1,2,3].indexOf(5));
      assert.equal(-1,[1,2,3].indexOf(0));
    })
  })
})