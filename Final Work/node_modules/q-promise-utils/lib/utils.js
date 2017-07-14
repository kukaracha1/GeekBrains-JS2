'use strict';
var q = require('q'),
    _ = require('lodash');

exports.sequence = function sequence(funcs) {
    var args = Array.prototype.slice.call(arguments, 1);

    return funcs.reduce(function(promise, func) {
        return promise.then(function() {
            return func.apply(null, args);
        });
    }, q());
};

exports.seqMap = function seqMap(array, callback) {
    return exports.sequence(array.map(function(elem) {
        return function() {
            return callback(elem);
        };
    }));
};

exports.waitForResults = function(promises) {
    return q.allSettled(promises)
        .then(function(results) {
            var rejected = _.find(results, {state: 'rejected'});
            if (rejected) {
                return q.reject(rejected.reason);
            }
        });
};
