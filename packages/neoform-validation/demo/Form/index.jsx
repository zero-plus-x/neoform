import React from 'react';
import { compose } from 'recompact';
import getByPath from 'lodash.get';
import Form from '~/neoform/lib/Form';
import FormValidation from '~/neoform-validation/lib/Form';

import Input from '../Input';

const requiredValidator = (value) => {
  return value === '' ?
         Promise.reject('required') :
         Promise.resolve();
};

const MyForm = ({ data, validate, validationStatus }) => (
  <form
    onSubmit={(e) => {
      validate().then(() => {
        console.log('data', data);
      });

      e.preventDefault();
    }}
  >
    <h1>simple form</h1>
    <h2>personal data</h2>
    <div>
      <label>
        first name (required)
        <Input defaultValue="" name="firstName" validator={requiredValidator}/>
      </label>
    </div>
    <div>
      <label>
        last name (required)
        <Input defaultValue="" name="lastName" validator={requiredValidator}/>
      </label>
    </div>
    <h2>phone numbers</h2>
    <ul>
      {
        data.phoneNumbers.map((phoneNumber, index) => (
          <li key={index}>
            <Input name={`phoneNumbers[${index}]`}/>
          </li>
        ))
      }
    </ul>
    <h2>friends</h2>
    <ul>
      {
        data.friends.map((friend, index) => (
          <li key={index}>
            <div>
              <label>
                first name
                <Input name={`friends[${index}].firstName`}/>
              </label>
            </div>
            <div>
              <label>
                last name
                <Input name={`friends[${index}].lastName`}/>
              </label>
            </div>
          </li>
        ))
      }
    </ul>
    <button type="submit">submit</button>
    {
      validationStatus === false &&
      (
        <div style={{ color: 'red' }}>Form is invalid</div>
      )
    }
  </form>
);

export default compose(
  Form(getByPath),
  FormValidation
)(MyForm);
