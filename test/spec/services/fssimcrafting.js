'use strict';

describe('Service: FSSimCrafting', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimCrafting;
  beforeEach(inject(function (_FSSimCrafting_) {
    FSSimCrafting = _FSSimCrafting_;
  }));

  it('should do something', function () {
    expect(!!FSSimCrafting).toBe(true);
  });

});
