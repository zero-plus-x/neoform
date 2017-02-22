import React, { PropTypes } from 'react';
import compose from 'recompact/compose';
import withState from 'recompact/withState';
import withProps from 'recompact/withProps';
import withHandlers from 'recompact/withHandlers';
import withContext from 'recompact/withContext';
import getContext from 'recompact/getContext';
import omitProps from 'recompact/omitProps';

const isValidForm = (validationStatus) => {
  return Object
    .keys(validationStatus)
    .every((name) => validationStatus[name].status);
};

export default (getValidator) => (Target) => {
  const fields = [];

  const FormValidation = (props) => (
    <Target {...props}/>
  );

  return compose(
    withState('validationStatus', 'setValidationStatus', {}),
    getContext({
      neoform: PropTypes.object
    }),
    withContext(
      {
        neoform: PropTypes.object
      },
      ({ neoform, setValidationStatus, validationStatus, validation }) => ({
        neoform: {
          ...neoform,
          getValidation: (name) => validationStatus[name] || {},
          validate(name, value) {
            const validator = getValidator(validation, name);

            validator(value)
              .then((message) => {
                setValidationStatus((prevState) => ({
                  ...prevState,
                  [name]: {
                    status: true,
                    message
                  }
                }));
              })
              .catch((message) => {
                setValidationStatus((prevState) => ({
                  ...prevState,
                  [name]: {
                    status: false,
                    message
                  }
                }));
              });
          },
          registerField: (name) => {
            if (fields.indexOf(name) === -1) {
              fields.push(name);
            }
          }
        }
      })
    ),
    withHandlers({
      onSubmit: ({ neoform, validation, setValidationStatus, onSubmit }) => (e) => {
        e.preventDefault();

        const validationStatus = {};

        Promise.all(
          fields.map((name) => {
            const validator = getValidator(validation, name);

            if (!validator) {
              return Promise.resolve();
            }

            const value = neoform.getValue(name);

            return validator(value)
              .then((message) => {
                validationStatus[name] = {
                  status: true,
                  message
                };
              })
              .catch((message) => {
                validationStatus[name] = {
                  status: false,
                  message
                };
              });
          })
        )
        .then(() => {
          setValidationStatus(validationStatus);

          if (isValidForm(validationStatus) && typeof onSubmit === 'function') {
            onSubmit();
          }
        });
      }
    }),
    withProps(
      ({ validationStatus }) => ({
        validationStatus: isValidForm(validationStatus)
      })
    ),
    omitProps([ 'neoform', 'setValidationStatus', 'validation' ])
  )(FormValidation);
};
