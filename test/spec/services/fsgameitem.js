'use strict';

describe('Service: FSRecipeDef', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSRecipeDef;
  beforeEach(inject(function (_FSRecipeDef_) {
    FSRecipeDef = _FSRecipeDef_;
  }));

  it('should do something', function () {
    expect(!!FSRecipeDef).toBe(true);
  });

});
