import React from 'react';
import { compose } from 'recompact';
import Field from '~/neoform/lib/Field';
import FieldValidation from '~/neoform-validation/lib/Field';

const MyInput = ({
  validate,
  validationStatus,
  validationMessage,
  ...props
}) => {
  const style = {
    backgroundColor: validationStatus === false ? 'red' : 'white'
  };
  const renderError = () => {
    if (validationStatus !== false || !validationMessage) {
      return null;
    }

    return (
      <span>{validationMessage}</span>
    );
  };

  return (
    <span>
      <input
        {...props}
        style={style}
        type="text"
        onBlur={validate}
      />
      {renderError()}
    </span>
  );
};

export default compose(
  Field('value', (e) => e.target.value),
  FieldValidation
)(MyInput);
