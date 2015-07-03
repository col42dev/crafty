'use strict';

describe('Service: fsCharacter', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var fsCharacter;
  beforeEach(inject(function (_fsCharacter_) {
    fsCharacter = _fsCharacter_;
  }));

  it('should do something', function () {
    expect(!!fsCharacter).toBe(true);
  });

});
