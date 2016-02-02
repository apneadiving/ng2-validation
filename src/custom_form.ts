import {Component, Input, OnInit} from 'angular2/core';
import {FormBuilder, AbstractControl, ControlGroup, Control} from 'angular2/common';
import {CustomValidationHandler, IValidation} from './custom_validation'
import {ConditionalDisplay, IConditionalDisplay} from './conditional_display';

interface ICheckboxChoice {
  name:    any,
  display: string
}

interface IRadioChoice {
  value:    any,
  display: string
}

export interface ICustomField {
  tag: string,
  tagType?: string, //useful for inputs: text by default but checkbox, radio
  label: string,
  name:  string,
  checkboxChoices?: ICheckboxChoice[]
  radioChoices?: IRadioChoice[]
};

@Component({
    selector: 'CustomForm',
    template: `
      <ngForm [ngFormModel]="localForm">
        <div *ngFor="#field of fields">
          <div *ngIf="isVisible(field.name)">
            <div *ngIf="isInput(field)">
              <label>
                {{ field.label }}
              </label>

              <div [ngSwitch]="field.tagType">
                <div *ngSwitchWhen="'checkbox'">
                  <div *ngFor="#choice of field.checkboxChoices">
                    <input type="checkbox" [(ngModel)]="model[field.name][choice.name]" [ngFormControl]="getControl(field)">
                    {{ choice.display }}
                  </div>
                </div>

                <div *ngSwitchWhen="'radio'">
                  <div *ngFor="#choice of field.radioChoices">
                    <input type="radio" [name]="field.name" [(ngModel)]="model[field.name]" [value]="choice.value" [ngFormControl]="getControl(field)">
                    {{ choice.display }}
                  </div>
                </div>

                <div *ngSwitchDefault>
                  <input type="text" [(ngModel)]="model[field.name]" [ngFormControl]="getControl(field)">
                </div>
              </div>

              <div *ngIf="!getControl(field).valid" class="ui error message">
                <ul>
                  <li *ngFor="#messageFn of errorFor(field)">
                    {{ messageFn() }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ngForm>`
})

export class CustomForm implements OnInit{

  @Input() model: any;
  @Input('validations') validationsJson: IValidation[];
  @Input() fields: ICustomField[];
  @Input() conditionalDisplay: IConditionalDisplay[];

  public  localForm: ControlGroup;
  public  controls: { [name: string]: Control };
  public  validationsHandler: CustomValidationHandler;
  public  errorPool = {};
  private displayHandler: ConditionalDisplay;

  constructor(private builder: FormBuilder){}

  ngOnInit(){
    this.displayHandler = new ConditionalDisplay(this.model, this.conditionalDisplay);

    this.validationsHandler = new CustomValidationHandler(this.model, this.validationsJson, this.isVisible.bind(this));

    this.buildFormParams();

    this.localForm = this.builder.group(this.controls);

    this.localForm.valueChanges.subscribe((v)=>{
      this.displayHandler.updateVisibility();
      this.toggleControls();
    });

    this.fetchErrors();
  }

  isVisible(fieldName: string): Boolean{
    return this.displayHandler.isVisible(fieldName);
  }

  isInput(field: ICustomField): Boolean{
    return field.tag === 'input';
  }

  getControl(field: ICustomField): AbstractControl{
    return this.controls[field.name];
  }

  errorFor(field: ICustomField): Function[]{
    return this.errorPool[field.name];
  }

  private buildFormParams(){
    this.controls = _.reduce(this.fields, (obj, field)=>{
      obj[field.name] = new Control("", this.validationsHandler.for(field.name));
      return obj;
    }, {});
  }

  private fetchErrors(){
    _.each(this.fields, (field)=> {
      this.errorPool[field.name] = [];

      this.getControl(field).valueChanges.subscribe(()=>{
        this.errorPool[field.name] = _.reduce(this.getControl(field).errors, (array, error)=>{
          if (this.isVisible(field.name) && _.has(error, 'messageFn'))
            array.push(error.messageFn);
          return array;
        }, []);
      });
    });
  }

  private toggleControls(){
    _.each(this.controls, (control, name)=>{
      if(!this.isVisible(name) && this.localForm.contains(name)){
        this.localForm.exclude(name);
      }
      if(this.isVisible(name) && !this.localForm.contains(name)){
        this.localForm.include(name);
      }
    });
  }

}

