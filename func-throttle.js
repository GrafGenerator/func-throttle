(function(root){

    var firstSet = function(paramsQueue){
        return paramsQueue.length === 0 ? null : paramsQueue[0]
    };

    var lastSet = function(paramsQueue){
        return paramsQueue.length === 0 ? null : paramsQueue[paramsQueue.length - 1]
    };

    var FuncThrottleFn = function(func, Promise){
        if(Promise === undefined || Promise === null){
            throw "Provide Promise implementation to works with FuncThrottle"
        }
        var func = func;
        var interval = 1000;
        var occurences = 1;
        var argsSelectorFn = lastSet;
        var isStopped = false;
        var resolveEach = false;

        this.StrategyFirstParams = firstSet;
        this.StrategyLastParams = lastSet;

        var paramsQueue = [];
        var timerId = null;

        var timerTick;
        var throttlePromise;
        var promiseRequested = false;

        timerTick = function(resolve){
            var paramsSet = argsSelectorFn(paramsQueue);
            paramsQueue = [];

            if(paramsSet !== null){
                if(func){
                    var originalResult = func.call(null, paramsSet);
                    resolve(originalResult);
                }
            }

            if(timerId !== null){
                clearTimeout(timerId);
            }

            // todo: maybe reject promise here?

            if(!isStopped){
                throttlePromise = new Promise(function(resolve){
                    timerId = setTimeout(function(){ timerTick(resolve)}, interval / occurences);
                });
                promiseRequested = false;
            }
        };

        
        promiseRequested = false;

        var neverFulfilledPromise = new Promise(function(_, __){});

        var throttleFn = function(){
            paramsQueue.push([].slice.call(arguments, 0));

            if(timerId === null){
                throttlePromise = new Promise(function(resolve){
                    timerId = setTimeout(function(){ timerTick(resolve)}, 0);
                });
            }

            var promise = !resolveEach && promiseRequested ? neverFulfilledPromise : throttlePromise;
            promiseRequested = true;

            return promise;
        }

        throttleFn.stop = function(){
            isStopped = true;
            return throttleFn;
        }

        throttleFn.occurs = function(n){
            occurences = n;
            return throttleFn;
        };

        throttleFn.per = function(i){
            interval = i;
            return throttleFn;
        };

        throttleFn.paramsSelector = function(selectorFn){
            argsSelectorFn = selectorFn;
            return throttleFn;
        };

        throttleFn.resolveEach = function(){
            resolveEach = true;
            return throttleFn;
        };

        throttleFn.resolveOnce = function(){
            resolveEach = false;
            return throttleFn;
        };

        return throttleFn;
    };

    if(module !== undefined && module.exports !== undefined){
        module.exports = FuncThrottleFn;
    }
    else{
        root.FuncThrottle = FuncThrottleFn;
    }
}).call(typeof window === "undefined" ? {} : window);