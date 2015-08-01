'use strict';

describe('Service: recipemodal', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var recipemodal;
  beforeEach(inject(function (_recipemodal_) {
    recipemodal = _recipemodal_;
  }));

  it('should do something', function () {
    expect(!!recipemodal).toBe(true);
  });

});
