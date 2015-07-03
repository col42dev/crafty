'use strict';

describe('Service: FSGatherable', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSGatherable;
  beforeEach(inject(function (_FSGatherable_) {
    FSGatherable = _FSGatherable_;
  }));

  it('should do something', function () {
    expect(!!FSGatherable).toBe(true);
  });

});
