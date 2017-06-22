import React from 'react';
import Field from '~/neoform/src/Field';

const MyInput = ({
  value = '',
  onChange,
  ...props
}) => (
  <input
    {...props}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default Field(MyInput);
