'use strict';

describe('Service: FSGameItem', function () {

  // load the service's module
  beforeEach(module('craftyApp'));

  // instantiate service
  var FSGameItem;
  beforeEach(inject(function (_FSGameItem_) {
    FSGameItem = _FSGameItem_;
  }));

  it('should do something', function () {
    expect(!!FSGameItem).toBe(true);
  });

});
