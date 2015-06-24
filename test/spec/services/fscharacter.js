'use strict';

describe('Service: FSCharacter', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSCharacter;
  beforeEach(inject(function (_FSCharacter_) {
    FSCharacter = _FSCharacter_;
  }));

  it('should do something', function () {
    expect(!!FSCharacter).toBe(true);
  });

});
