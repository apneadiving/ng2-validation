System.register(['angular2/testing'], function(exports_1) {
    var testing_1;
    var CustomValidationHandler;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            }],
        execute: function() {
            CustomValidationHandler = {
                foo: function () { return 1; }
            };
            testing_1.describe('Speedtrap', function () {
                testing_1.it('tickets a car at more than 60mph', function () {
                    testing_1.expect(CustomValidationHandler.foo()).toEqual(1);
                });
                testing_1.it('tickets a car at more than 60mph', function () {
                    testing_1.expect(CustomValidationHandler.foo()).toEqual(1);
                });
            });
        }
    }
});
