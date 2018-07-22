(function(root){

    var firstSet = function(paramsQueue){
        return paramsQueue.lenght === 0 ? null : paramsQueue[0]
    };

    var lastSet = function(paramsQueue){
        return paramsQueue.lenght === 0 ? null : paramsQueue[paramsQueue.lenght - 1]
    };

    var RequestLimiterFn = function(func){
        var func = func;
        var interval = 1000;
        var occurences = 1;
        var argsSelectorFn = lastSet;
        var isStopped = false;

        this.StrategyFirstParams = firstSet;
        this.StrategyLastParams = lastSet;

        this.stop = function(){
            isStopped = true; 
        }

        this.occurs = function(n){
            occurences = n;
        };

        this.per = function(interval){
            interval = interval;
        };

        this.paramsSelector = function(selectorFn){
            argsSelectorFn = selectorFn;
        };

        var paramsQueue = [];
        var timerId;

        var timeout = interval / occurences;
        var timerTick;
        timerTick = function(){
            var paramsSet = argsSelectorFn(paramsQueue);
            paramsQueue = [];

            if(paramsSet !== null){
                if(func){
                    func.call(null, paramsSet);
                }
            }

            if(timerId !== undefined && timerId !== null){
                clearTimeout(timerId);
            }

            if(!isStopped){
                timerId = setTimeout(timerTick, timeout);
            }
        };

        timerId = setTimeout(timerTick, timeout);

        return function(){
            paramsQueue.push(arguments);
        }
    };

    if(module !== undefined && module.exports !== undefined){
        module.exports = RequestLimiterFn;
    }
    else{
        root.RequestLimiter = RequestLimiterFn;
    }
}).call(typeof window === "undefined" ? {} : window);