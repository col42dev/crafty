'use strict';

describe('Service: fsreward', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var fsreward;
  beforeEach(inject(function (_fsreward_) {
    fsreward = _fsreward_;
  }));

  it('should do something', function () {
    expect(!!fsreward).toBe(true);
  });

});
