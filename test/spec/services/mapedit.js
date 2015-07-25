'use strict';

describe('Service: mapedit', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var mapedit;
  beforeEach(inject(function (_mapedit_) {
    mapedit = _mapedit_;
  }));

  it('should do something', function () {
    expect(!!mapedit).toBe(true);
  });

});
