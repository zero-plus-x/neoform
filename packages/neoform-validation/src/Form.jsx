import React, { PropTypes } from 'react';
import compose from 'recompact/compose';
import withState from 'recompact/withState';
import withProps from 'recompact/withProps';
import withHandlers from 'recompact/withHandlers';
import withContext from 'recompact/withContext';
import getContext from 'recompact/getContext';
import omitProps from 'recompact/omitProps';
import pSettle from 'p-settle';

export default (handlerName) => (Target) => {
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
    withHandlers({
      [handlerName]: ({ setValidationStatus, ...props }) => (e) => {
        e.preventDefault();

        pSettle(
          validators.map((validator) => validator())
        )
          .then((results) => {
            const validFields = results
              .filter((result) => result.isFulfilled)
              .map((result) => result.value);
            const invalidFields = results
              .filter((result) => result.isRejected)
              .map((result) => result.reason);

            setValidationStatus((state) =>
              state
                .filter((name) => validFields.indexOf(name) === -1)
                .concat(invalidFields)
            );

            if (invalidFields.length === 0) {
              const externalHandler = props[handlerName];

              if (typeof externalHandler === 'function') {
                externalHandler();
              }
            }
          });
      }
    }),
    withProps(
      ({ validationStatus }) => ({
        validationStatus: validationStatus.length === 0
      })
    ),
    omitProps([ 'neoform', 'setValidationStatus' ])
  )(FormValidation);
};
