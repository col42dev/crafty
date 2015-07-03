'use strict';

describe('Service: FSTask', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSTask;
  beforeEach(inject(function (_FSTask_) {
    FSTask = _FSTask_;
  }));

  it('should do something', function () {
    expect(!!FSTask).toBe(true);
  });

});
