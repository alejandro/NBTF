var nbtf   = require('../')
  , fs     = require('fs')
  , assert = require('assert')
  , parser = (new nbtf).parse
  , output = parser(fs.readFileSync(__dirname +'/fixtures/bigtest.nbt'))
  , longBufferName ='byteArrayTest (the first 1000 values of (n*n*255+n*7)%100, starting with n=0 (0, 62, 34, 16, 8, ...))'
  ;

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

describe('Simple NBTF test', function(){
  describe('parser', function(){
    it('should return an object', function(){
      assert.equal(typeof output, 'object')
    })
  })
  describe('keys',function(){
    it('should have a Level key',function(){
      assert.equal(typeof output.Level, 'object')
    })
    it('#stringText should return a string', function(){
      assert.equal(typeof output.Level.stringTest,'string')
    })
    it('key should return a Buffer',function(){
      assert.equal(Buffer.isBuffer(output.Level[longBufferName]), true)
    })
    it('double, Float, int, double keys should return a valid number', function(){
      assert.equal(isNumber(output.Level.doubleTest),true)
      assert.equal(isNumber(output.Level.byteTest),true)
      assert.equal(isNumber(output.Level.intTest),true)
      assert.equal(isNumber(output.Level.floatTest),true)
      assert.equal(isNumber(output.Level.longTest),true)
      assert.equal(isNumber(output.Level.shortTest),true)
    })
  })
})