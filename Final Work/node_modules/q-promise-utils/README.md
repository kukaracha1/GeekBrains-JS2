# q-promise-utils

Several utils for simpifying interaction with multiple async operations.

## API

### utils.sequence(funcs, [args])

Executes `funcs` in async manner one by one.
Arguments:
* funcs - functions to execute
* args (optional) - arguments to pass to each function

Example:

```js
var foo = function() {},
    bar = function() {};

utils.sequence([foo, bar], 'some-string', 100500)
    .then(function() {
        // first executed `foo('some-string', 100500)`,
        // then `bar('some-string', 100500)`,
        // then arrives to this code block
    });
```

### utils.seqMap(items, callback)

Serially applies `callback` to each item in `items` array in async manner

Example:

```js
var items = ['foo', 'bar'],
    callback = function() {};

utils.seqMap(items, callback)
    .then(function() {
        //first runs `callback` with arg `foo`, then with arg `bar`, next arrives to this code block
    });
```

##utils.waitForResults(promises)

Waits for all promises in array to be resolved or rejected.
Unlike Q.allSettled, rejects when any of the promises is rejected.
Unlike Q.all does not immediately rejects a promise on a first error and waits for other operations to complete.

Example:

```js
var delay = q.delay(100),
    rejected = q.reject('whatever');

utils.waitForResults([rejected, delay])
    .fail(function(reason) {
        //arrives here after 100ms with reject reason `whatever`
    });
```
