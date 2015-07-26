'use strict';

describe('Service: worldmap', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var worldmap;
  beforeEach(inject(function (_worldmap_) {
    worldmap = _worldmap_;
  }));

  it('should do something', function () {
    expect(!!worldmap).toBe(true);
  });

});
