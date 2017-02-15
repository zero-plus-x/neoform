import React from 'react';
import { compose } from 'recompact';
import Field from '~/neoform/lib/Field';
import FieldValidation from '~/neoform-validation/lib/Field';

const renderError = (validationStatus, validationMessage) => {
  if (validationStatus !== false) {
    return null;
  }

  return (
    <span>{validationMessage}</span>
  );
};

const MyInput = ({
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
        type="text"
        onBlur={validate}
      />
      {renderError(validationStatus, validationMessage)}
    </span>
  );
};

export default compose(
  Field('value', (e) => e.target.value),
  FieldValidation
)(MyInput);
