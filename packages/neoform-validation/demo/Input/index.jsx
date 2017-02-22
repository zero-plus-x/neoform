import React from 'react';
import { compose } from 'recompact';
import Field from '~/neoform/src/Field';
import FieldValidation from '~/neoform-validation/src/Field';

const renderError = ({ status, message }) => {
  if (status !== false) {
    return null;
  }

  return (
    <span>{message}</span>
  );
};

const MyInput = ({ validation, ...props }) => {
  const style = {
    backgroundColor: validation.status === false ? 'red' : 'white'
  };

  return (
    <span>
      <input {...props} style={style}/>
      {renderError(validation)}
    </span>
  );
};

export default compose(
  Field('value', (e) => e.target.value),
  FieldValidation('onBlur')
)(MyInput);
