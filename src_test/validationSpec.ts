import { it,
  describe,
  expect,
  inject,
  fakeAsync,
  afterEach,
  beforeEachProviders,
  tick
} from'angular2/testing';

// import {CustomValidationHandler, IValidation} from '../src/custom_validation'

var CustomValidationHandler = {
  foo: function(){ return 1; }
}


describe('Speedtrap', function() {
  it('tickets a car at more than 60mph', function() {
    expect(CustomValidationHandler.foo()).toEqual(1);
  });

   it('tickets a car at more than 60mph', function() {
    expect(CustomValidationHandler.foo()).toEqual(1);
  });
});
