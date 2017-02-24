import React from 'react';
import { compose } from 'recompact';
import Field from '~/neoform/src/Field';
import FieldValidation from '~/neoform-validation/src/Field';

const renderError = (status, message) => {
  if (status !== false) {
    return null;
  }

  return (
    <span>{message}</span>
  );
};

const MyInput = ({ validationStatus, validationMessage, ...props }) => {
  const style = {
    backgroundColor: validationStatus === false ? 'red' : 'white'
  };

  return (
    <span>
      <input {...props} style={style}/>
      {renderError(validationStatus, validationMessage)}
    </span>
  );
};

export default compose(
  Field('value', (e) => e.target.value),
  FieldValidation('onBlur')
)(MyInput);
