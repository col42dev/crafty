'use strict';

describe('Service: FSFactory', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSFactory;
  beforeEach(inject(function (_FSFactory_) {
    FSFactory = _FSFactory_;
  }));

  it('should do something', function () {
    expect(!!FSFactory).toBe(true);
  });

});
