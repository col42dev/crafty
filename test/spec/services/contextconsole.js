'use strict';

describe('Service: contextconsole', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var contextconsole;
  beforeEach(inject(function (_contextconsole_) {
    contextconsole = _contextconsole_;
  }));

  it('should do something', function () {
    expect(!!contextconsole).toBe(true);
  });

});
