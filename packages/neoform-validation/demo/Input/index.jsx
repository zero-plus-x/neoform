/* eslint-disable react/jsx-no-bind */
import React from 'react';

import { Field } from 'neoform';
import { FieldValidation } from '../../src';

const MyInput = ({
  value = '',
  onChange,
  validate,
  validationStatus,
  validationMessage,
  ...props
}) => {
  const style = {
    backgroundColor: validationStatus === false ? 'red' : 'white'
  };

  return (
    <span>
      <input
        {...props}
        style={style}
        value={value}
        onBlur={validate}
        onChange={(e) => onChange(e.target.value)}
      />
      {validationStatus === false && (
        <span>{validationMessage}</span>
      )}
    </span>
  );
};

export default Field(FieldValidation(MyInput));
