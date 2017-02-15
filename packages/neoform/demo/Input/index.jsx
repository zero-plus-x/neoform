import React from 'react';
import Field from '~/neoform/lib/Field';

const MyInput = (props) => (
  <input {...props} type="text"/>
);

export default Field('value', (e) => e.target.value)(MyInput);
