'use strict';

describe('Service: FSSimTasks', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimTasks;
  beforeEach(inject(function (_FSSimTasks_) {
    FSSimTasks = _FSSimTasks_;
  }));

  it('should do something', function () {
    expect(!!FSSimTasks).toBe(true);
  });

});
