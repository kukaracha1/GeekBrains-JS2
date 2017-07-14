'use strict';
var q = require('q'),
    utils = require('../../lib/utils');

/* jshint expr: true */
describe('utils', function() {
    describe('sequence', function() {
        it('should return fulfilled promise if no funcs passed', function() {
            return expect(utils.sequence([])).to.be.eventually.fulfilled;
        });

        it('should execute passed functions in order they passed', function() {
            var first = sinon.stub().named('first'),
                second = sinon.stub().named('second'),
                mediator = sinon.stub();

            first.returns(q.delay(1).then(mediator));

            return utils.sequence([first, second])
                .then(function() {
                    expect(mediator).to.have.been.calledAfter(first)
                        .and.to.have.been.calledBefore(second);
                });
        });

        it('should pass args to functions', function() {
            var fn = sinon.stub().named('fn');

            return utils.sequence([fn], 'arg1', 'arg2')
                .then(function() {
                    expect(fn).to.have.been.calledWith('arg1', 'arg2');
                });
        });
    });

    describe('seqMap', function() {
        it('should return fulfilled promise if no items to map passed', function() {
            return expect(utils.seqMap([])).to.be.eventually.fulfilled;
        });

        it('should execute callback for each item in array', function() {
            var callback = sinon.spy().named('callback');

            return utils.seqMap(['first', 'second'], callback)
                .then(function() {
                    expect(callback).to.have.been.calledTwice;
                });
        });

        it('should call execute callback for items in order items passed', function() {
            var callback = sinon.spy().named('callback');

            return utils.seqMap(['first', 'second'], callback)
                .then(function() {
                    expect(callback.firstCall.args[0]).to.be.equal('first');
                    expect(callback.secondCall.args[0]).to.be.equal('second');
                });
        });
    });

    describe('waitForResults', function() {
        it('should return fulfilled promise if no promises passed', function() {
            return expect(utils.waitForResults([])).to.be.eventually.fulfilled;
        });

        it('should wait until all promises resolved', function() {
            var first = q.delay(50),
                second = q.delay(100);

            return utils.waitForResults([first, second])
                .then(function() {
                    expect(first).to.be.resolved;
                    expect(second).to.be.resolved;
                });
        });

        it('should reject if any of passed promises rejected', function() {
            return expect(utils.waitForResults(q.reject('foo'), q()))
                .to.be.eventually.rejectedWith('foo');
        });

        it('should not immediately reject when any of promises is rejected', function() {
            var first = q.reject(),
                second = q.delay(100);

            function checkPromises() {
                expect(first).to.be.resolved;
                expect(second).to.be.resolved;
            }

            return utils.waitForResults([first, second])
                .then(checkPromises, checkPromises);
        });
    });
});
