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
        setTimeout(resolve, 1000);
      })
        .then(function(){
          done();
        });
    });

    it("first call fires target func immediately", function(done) {
      var throttledFunc;
      var eps = 2;
      var targetFireTime;

      var testFunc = function(){
        targetFireTime = new Date();
      };

      var throttledFunc = funcThrottle(testFunc, Promise).occurs(1).per(1000);

      var callTime = new Date();
      throttledFunc()
        .then(function(){
          var actualEps = targetFireTime - callTime;

          if(actualEps > eps) {
            done(new Error("Eps is too big, " + actualEps));
          }

          done();
        })
    });

    it("calls target func with interval specified", function(done) {
      this.timeout(10000);

      var throttledFunc;
      var interval = 500;
      var eps = 2;
      var times = [];

      var testFunc = function(){
        times.push(new Date());
      };

      var throttledFunc = funcThrottle(testFunc, Promise).occurs(1).per(interval);

      for(var i = 0; i < 10; i++){
        setTimeout(throttledFunc, i * 200);
      }

      new Promise(function(resolve){
        setTimeout(resolve, 3000);
      })
        .then(function(){
          for(var i = 1; i < times.length; i++){
            var timesDelta = times[i] - times[i - 1];
            var actualEps = Math.abs(timesDelta - interval);

            if(actualEps > eps) {
              done(new Error("Interval not match, expected " + interval + ", actual " + timesDelta, ", eps " + actualEps));
            }
          }

          done();
        })
    });
  });
});
