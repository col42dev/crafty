'use strict';

describe('Service: modalservice', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var modalservice;
  beforeEach(inject(function (_modalservice_) {
    modalservice = _modalservice_;
  }));

  it('should do something', function () {
    expect(!!modalservice).toBe(true);
  });

});
