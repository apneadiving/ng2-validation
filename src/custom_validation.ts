import {Validators, AbstractControl} from 'angular2/common';

export interface IValidation {
  name: string,
  field: string,
  args?: Object,
  error_message?: string
};

function presenceValidator(model, validationObject, isVisible):Function{
  return function(control: AbstractControl){
    // if (!isVisible(validationObject.field))
    //   return;

    if (_.isEmpty(control.value))
      return { presence: { messageFn: errorMessageFor(model, validationObject) } };
  };
}
function equalityValidator(model, validationObject, isVisible):Function{
  return function(control: AbstractControl){
    // if (!isVisible(validationObject.field))
    //   return;
    if (!_.isEqual(control.value, validationObject.args.value))
      return { equality: { messageFn: errorMessageFor(model, validationObject) } };
  };
}

function createValidations(model, validationObjects: IValidation[], isVisible: Function): Function{
  return Validators.compose(_.map(validationObjects, function(validationObject){
    return validatorMapping[validationObject.name](model, validationObject, isVisible);
  }));
}

function errorMessageFor(model, jsonValidation: IValidation): Function{
  return function(){
    if (_.has(jsonValidation, 'error_message'))
      return jsonValidation.error_message;
    else
      return defaultErrorMessagesMapping[jsonValidation.name](jsonValidation);
  };
}

let validatorMapping = {
  'presence' : presenceValidator,
  'equality' : equalityValidator
}

let defaultErrorMessagesMapping = {
  'presence' : function(jsonValidation) { return "must be present"; },
  'equality' : function(jsonValidation) { return `must be equal to ${jsonValidation.args.value}`; }
}

export class CustomValidationHandler {
  handler = {};

  constructor(private model: any, validationsJson: IValidation[], private isVisible: Function){
    this.processValidationJson(validationsJson);
  }

  for(fieldName):Function {
    return this.handler[fieldName];
  }

  private processValidationJson(validationsJson){
    _.chain(validationsJson)
      .groupBy(function(val){ return val.field; })
      .each((validationsObjects, fieldName)=>{
        this.handler[fieldName] = createValidations(this.model, validationsObjects, this.isVisible);
      })
      .value()
  }
}
