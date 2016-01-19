import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ICustomField, CustomForm} from './custom_form'
import {IValidation} from './custom_validation'
import {IConditionalDisplay} from './conditional_display'

@Component({
    selector: 'hello-app',
    template: `
    <form #form="ngForm">
      <CustomForm #customForm
        [model]="user.customFields"
        [fields]="fields"
        [validations]="validationsJson"
        [conditionalDisplay]="conditionalDisplay"
      >
      </CustomForm>

      <p>main form validity: {{ form.valid }}</p>
      <p>subform validity: {{ customForm.localForm.valid }}</p>
    </form>
    {{ user | json }}
    `,
    directives: [CustomForm]
})

export class HelloApp {
  user = {
    customFields: {
      favoritePet: 'lemur',
      color: '',
      likes_animals: {}
    }
  };

  conditionalDisplay: IConditionalDisplay[] = [{
    field: 'favoritePet',
    condition: {
     field:    'likes_animals.yes',
     operator: '==',
     value:    true
    }
  }];

  validationsJson: IValidation[] = [
    { 'name': 'presence', 'field': 'favoritePet' },
    { 'name': 'equality', 'field': 'favoritePet', 'args': { 'value': 'cat' }, error_message: 'You are not allowed to like those' },
    { 'name': 'presence', 'field': 'color' },
    { 'name': 'equality', 'field': 'color', 'args': { 'value': 'blue' } }
  ];

  fields: ICustomField[] =[
    {
      tag:     'input',
      tagType: 'checkbox',
      label:   'Do you like animals?',
      checkboxChoices: [{ name: 'yes', display: '' }],
      name:    'likes_animals'
    },
    {
      tag:   'input',
      label: 'what is your favorite pet?',
      name:  'favoritePet'
    },
    {
      tag:   'input',
      label: 'what is your favorite color?',
      name:  'color'
    }
  ]
}

bootstrap(HelloApp);

