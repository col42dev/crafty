'use strict';

describe('Service: FSHarvestable', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSHarvestable;
  beforeEach(inject(function (_FSHarvestable_) {
    FSHarvestable = _FSHarvestable_;
  }));

  it('should do something', function () {
    expect(!!FSHarvestable).toBe(true);
  });

});
