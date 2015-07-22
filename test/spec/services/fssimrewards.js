'use strict';

describe('Service: FSSimRewards', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimRewards;
  beforeEach(inject(function (_FSSimRewards_) {
    FSSimRewards = _FSSimRewards_;
  }));

  it('should do something', function () {
    expect(!!FSSimRewards).toBe(true);
  });

});
