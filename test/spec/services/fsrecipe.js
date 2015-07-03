'use strict';

describe('Service: FSRecipe', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSRecipe;
  beforeEach(inject(function (_FSRecipe_) {
    FSRecipe = _FSRecipe_;
  }));

  it('should do something', function () {
    expect(!!FSRecipe).toBe(true);
  });

});
