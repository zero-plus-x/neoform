import React from 'react';

import { Field } from 'neoform';
import { FieldValidation } from '../../src';

const renderError = (status, message) => {
  if (status !== false) {
    return null;
  }

  return (
    <span>{message}</span>
  );
};

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
      {renderError(validationStatus, validationMessage)}
    </span>
  );
};

export default Field(FieldValidation(MyInput));
