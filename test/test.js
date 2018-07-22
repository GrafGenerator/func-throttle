var assert = require("assert");
var Promise = require("promise");
var funcThrottle = require("../func-throttle");

describe("func-throttle", function() {
  describe("in runtime", function() {
    it("fires target func", function(done) {
      var testFunc = function(){
        assert.equal(true, true);
      };

      var throttledFunc = funcThrottle(testFunc, Promise).occurs(1).per(1000);

      throttledFunc()
        .then(function(){
          done();
        });
    });

    it("fires target func only once per interval", function(done) {
      var callCount = 0;
      var testFunc = function(){
        callCount++;
        assert.equal(callCount, 1);
      };

      var throttledFunc = funcThrottle(testFunc, Promise).occurs(1).per(1000);

      var promise = null;
      for(var i = 0; i < 10; i++){
        var tmp = throttledFunc();
        if(promise === null){
          promise = tmp;
        }
      }

      promise
        .then(function(){
          done();
        })
    });

    it("resolves promise", function(done) {
      var testFunc = function(){
      };

      var throttledFunc = funcThrottle(testFunc, Promise).occurs(1).per(1000);

      throttledFunc()
        .then(function(){
          assert.equal(true, true);
          done();
        });
    });

    it("never call target func if no requests made", function(done) {
      var testFunc = function(){
        assert.fail("testFunc shall never be called here!")
      };

      var throttledFunc = funcThrottle(testFunc, Promise).occurs(1).per(500);

      new Promise(function(resolve){
        setTimeout(function() { resolve(); }, 1000);
      })
        .then(function(){
          done();
        });
    });
  });
});
