'use strict';

describe('Service: FSObject', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSObject;
  beforeEach(inject(function (_FSObject_) {
    FSObject = _FSObject_;
  }));

  it('should do something', function () {
    expect(!!FSObject).toBe(true);
  });

});
