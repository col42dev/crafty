'use strict';

describe('Service: FSSimRules', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimRules;
  beforeEach(inject(function (_FSSimRules_) {
    FSSimRules = _FSSimRules_;
  }));

  it('should do something', function () {
    expect(!!FSSimRules).toBe(true);
  });

});
