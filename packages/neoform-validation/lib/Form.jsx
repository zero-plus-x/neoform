import React, { PropTypes } from 'react';
import compose from 'recompact/compose';
import withState from 'recompact/withState';
import withProps from 'recompact/withProps';
import withContext from 'recompact/withContext';
import getContext from 'recompact/getContext';
import omitProps from 'recompact/omitProps';

export default (Target) => {
  const validators = [];

  const FormValidation = (props) => (
    <Target {...props}/>
  );

  return compose(
    withState('validationStatus', 'setValidationStatus', 0),
    getContext({
      neoform: PropTypes.object
    }),
    withContext(
      {
        neoform: PropTypes.object
      },
      ({ neoform, setValidationStatus }) => ({
        neoform: {
          ...neoform,
          markValid: () => setValidationStatus((state) => state > 0 ? state - 1 : 0),
          markInvalid: () => setValidationStatus((state) => state + 1),
          registerValidator: (validator) => validators.push(validator)
        }
      })
    ),
    withProps(
      ({ validationStatus }) => ({
        validate() {
          return Promise.all(
            validators.map((validator) => validator())
          );
        },
        validationStatus: validationStatus === 0
      })
    ),
    omitProps([ 'neoform', 'setValidationStatus' ])
  )(FormValidation);
};
