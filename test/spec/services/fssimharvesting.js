'use strict';

describe('Service: FSSimHarvesting', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimHarvesting;
  beforeEach(inject(function (_FSSimHarvesting_) {
    FSSimHarvesting = _FSSimHarvesting_;
  }));

  it('should do something', function () {
    expect(!!FSSimHarvesting).toBe(true);
  });

});
