/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React from 'react';

import { form } from '../../src';
import Input from '../Input';

const MyForm = ({ data, onSubmit }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <h2>personal data</h2>
    <div>
      <label>
        first name
        <Input name="firstName"/>
      </label>
    </div>
    <div>
      <label>
        last name
        <Input name="lastName"/>
      </label>
    </div>
    <h2>friends</h2>
    <ul>
      {
        data.friends.map((friend, index) => (
          <li key={`friends.${index}`}>
            <div>
              <label>
                first name
                <Input name={`friends.${index}.firstName`}/>
              </label>
            </div>
            <div>
              <label>
                last name
                <Input name={`friends.${index}.lastName`}/>
              </label>
            </div>
          </li>
        ))
      }
    </ul>
    <button type="submit">submit</button>
  </form>
);

export default form(MyForm);
