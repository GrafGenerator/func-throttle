# func-throttle
Small no-dependencies ES5 utility to implement simple function calls throttling.

# Example usage
func-throttle is available either as node package or global function.

In NodeJS environment do classic:
```js
var FuncThrottle = require("func-throttle");
```

For usage as global function just include the script into the page:
```html
<script src="func-throttle.js" />
```
It will create window.FuncThrottle variable which can be used directly as `FuncThrottle

Then use func-throttle to create throttled version of your function:
```js
    var requestDataFunc = function(){
        // fetch data from some URL
    };

    var throttledRequest = FuncThrottle(testFunc, Promise)
        .occurs(2) // twice
        .per(1000); // per second

    someForm.on("submit", function(){
        throttledRequest
            .then(function(result){
                // re-render view
            });
    });
```

See [test.js](test/test.js) for more usage examples.

# Development
Run `npm i` to install required dependencies, and `npm test` to execute a bunch of unit-tests to control the integrity of func-throttle.

# License
MIT