'use strict';

describe('Service: FSSimGathering', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimGathering;
  beforeEach(inject(function (_FSSimGathering_) {
    FSSimGathering = _FSSimGathering_;
  }));

  it('should do something', function () {
    expect(!!FSSimGathering).toBe(true);
  });

});
