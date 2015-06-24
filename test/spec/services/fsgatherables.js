'use strict';

describe('Service: FSGatherables', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSGatherables;
  beforeEach(inject(function (_FSGatherables_) {
    FSGatherables = _FSGatherables_;
  }));

  it('should do something', function () {
    expect(!!FSGatherables).toBe(true);
  });

});
