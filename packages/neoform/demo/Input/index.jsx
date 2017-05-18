import React from 'react';
import Field from '~/neoform/src/Field';

const MyInput = ({ value, onChange, ...props }) => (
  <input
    {...props}
    value={value}
    onChange={onChange}
  />
);

export default Field((e) => e.target.value)(MyInput);
