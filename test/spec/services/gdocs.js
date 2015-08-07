'use strict';

describe('Service: gdocs', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var gdocs;
  beforeEach(inject(function (_gdocs_) {
    gdocs = _gdocs_;
  }));

  it('should do something', function () {
    expect(!!gdocs).toBe(true);
  });

});
