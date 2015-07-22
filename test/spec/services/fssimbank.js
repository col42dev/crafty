'use strict';

describe('Service: FSSimBank', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimBank;
  beforeEach(inject(function (_FSSimBank_) {
    FSSimBank = _FSSimBank_;
  }));

  it('should do something', function () {
    expect(!!FSSimBank).toBe(true);
  });

});
