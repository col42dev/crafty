'use strict';

describe('Service: fscontextconsole', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var fscontextconsole;
  beforeEach(inject(function (_fscontextconsole_) {
    fscontextconsole = _fscontextconsole_;
  }));

  it('should do something', function () {
    expect(!!fscontextconsole).toBe(true);
  });

});
