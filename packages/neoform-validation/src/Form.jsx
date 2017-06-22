import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompact/compose';
import withState from 'recompact/withState';
import withProps from 'recompact/withProps';
import withHandlers from 'recompact/withHandlers';
import withContext from 'recompact/withContext';
import getContext from 'recompact/getContext';
import omitProps from 'recompact/omitProps';

const isValidForm = (validationFields) => {
  return Object
    .keys(validationFields)
    .every((name) => validationFields[name].status);
};

export default (Target) => {
  const validators = {};

  const FormValidation = (props) => (
    <Target {...props}/>
  );

  return compose(
    withState('validationFields', 'setValidationFields', {}),
    getContext({
      neoform: PropTypes.object
    }),
    withContext(
      {
        neoform: PropTypes.object
      },
      ({ neoform, setValidationFields, validationFields }) => ({
        neoform: {
          ...neoform,
          getValidation: (name) => validationFields[name] || {},
          validate(name) {
            const validator = validators[name];
            const value = neoform.getValue(name);

            validator(value)
              .then((message) => {
                setValidationFields((prevState) => ({
                  ...prevState,
                  [name]: {
                    status: true,
                    message
                  }
                }));
              })
              .catch((message) => {
                setValidationFields((prevState) => ({
                  ...prevState,
                  [name]: {
                    status: false,
                    message
                  }
                }));
              });
          },
          registerValidator: (name, validator) => {
            validators[name] = validator;
          }
        }
      })
    ),
    withHandlers({
      validate: ({ neoform, setValidationFields }) => (externalHandler) => {
        const validationFields = {};

        return Promise.all(
          Object.keys(validators)
            .map((name) => {
              const validator = validators[name];
              const value = neoform.getValue(name);

              return validator(value)
                .then((message) => {
                  validationFields[name] = {
                    status: true,
                    message
                  };
                })
                .catch((message) => {
                  validationFields[name] = {
                    status: false,
                    message
                  };
                });
            })
        )
        .then(() => {
          setValidationFields(validationFields);

          if (isValidForm(validationFields) && typeof externalHandler === 'function') {
            externalHandler();
          }
        });
      }
    }),
    withProps(
      ({ validationFields }) => ({
        validationStatus: isValidForm(validationFields)
      })
    ),
    omitProps([ 'neoform', 'setValidationFields', 'validationFields' ])
  )(FormValidation);
};
