/* eslint-disable react/jsx-no-bind */
import React from 'react';

import { field } from '../../src';

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

export default field(MyInput);
