'use strict';

describe('Service: FSUIEventHandler', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSUIEventHandler;
  beforeEach(inject(function (_FSUIEventHandler_) {
    FSUIEventHandler = _FSUIEventHandler_;
  }));

  it('should do something', function () {
    expect(!!FSUIEventHandler).toBe(true);
  });

});
