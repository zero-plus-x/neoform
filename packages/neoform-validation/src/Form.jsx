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

export default (handlerName) => (Target) => {
  const validators = {};

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
      ({ neoform, setValidationStatus, validationStatus }) => ({
        neoform: {
          ...neoform,
          getValidation: (name) => validationStatus[name] || {},
          validate(name) {
            const validator = validators[name];
            const value = neoform.getValue(name);

            if (validator) {
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
            }
          },
          registerValidator: (name, validator) => {
            validators[name] = validator;
          }
        }
      })
    ),
    withHandlers({
      [handlerName]: ({ neoform, setValidationStatus, ...props }) => (e) => {
        e.preventDefault();

        const validationStatus = {};

        Promise.all(
          Object.keys(validators)
            .map((name) => {
              const validator = validators[name];
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

          const externalHandler = props[handlerName];

          if (isValidForm(validationStatus) && typeof externalHandler === 'function') {
            externalHandler();
          }
        });
      }
    }),
    withProps(
      ({ validationStatus }) => ({
        validation: {
          status: isValidForm(validationStatus),
          fields: validationStatus
        }
      })
    ),
    omitProps([ 'neoform', 'setValidationStatus', 'validationStatus' ])
  )(FormValidation);
};
