'use strict';

describe('Service: FSSimDataJSON', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSSimDataJSON;
  beforeEach(inject(function (_FSSimDataJSON_) {
    FSSimDataJSON = _FSSimDataJSON_;
  }));

  it('should do something', function () {
    expect(!!FSSimDataJSON).toBe(true);
  });

});
