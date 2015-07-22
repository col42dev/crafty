'use strict';

describe('Service: FSSimObjectChannel', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimObjectChannel;
  beforeEach(inject(function (_FSSimObjectChannel_) {
    FSSimObjectChannel = _FSSimObjectChannel_;
  }));

  it('should do something', function () {
    expect(!!FSSimObjectChannel).toBe(true);
  });

});
