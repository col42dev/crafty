'use strict';

describe('Service: FSSimObjectFactory', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimObjectFactory;
  beforeEach(inject(function (_FSSimObjectFactory_) {
    FSSimObjectFactory = _FSSimObjectFactory_;
  }));

  it('should do something', function () {
    expect(!!FSSimObjectFactory).toBe(true);
  });

});
