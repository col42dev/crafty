'use strict';

describe('Service: FSService', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSService;
  beforeEach(inject(function (_FSService_) {
    FSService = _FSService_;
  }));

  it('should do something', function () {
    expect(!!FSService).toBe(true);
  });

});
