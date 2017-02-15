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
    withState('validationStatus', 'setValidationStatus', []),
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
          markValid: (name) => setValidationStatus((state) => {
            if (state.indexOf(name) >= 0) {
              return state.filter((item) => item !== name);
            }

            return state;
          }),
          markInvalid: (name) => setValidationStatus((state) => {
            if (state.indexOf(name) === -1) {
              return state.concat(name);
            }

            return state;
          }),
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
        validationStatus: validationStatus.length === 0
      })
    ),
    omitProps([ 'neoform', 'setValidationStatus' ])
  )(FormValidation);
};
