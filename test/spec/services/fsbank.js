'use strict';

describe('Service: FSBank', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSBank;
  beforeEach(inject(function (_FSBank_) {
    FSBank = _FSBank_;
  }));

  it('should do something', function () {
    expect(!!FSBank).toBe(true);
  });

});
