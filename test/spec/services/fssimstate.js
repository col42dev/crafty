'use strict';

describe('Service: FSSimState', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimState;
  beforeEach(inject(function (_FSSimState_) {
    FSSimState = _FSSimState_;
  }));

  it('should do something', function () {
    expect(!!FSSimState).toBe(true);
  });

});
