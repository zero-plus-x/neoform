import React, { PropTypes } from 'react';
import compose from 'recompact/compose';
import withState from 'recompact/withState';
import withProps from 'recompact/withProps';
import withHandlers from 'recompact/withHandlers';
import lifecycle from 'recompact/lifecycle';
import setPropTypes from 'recompact/setPropTypes';
import getContext from 'recompact/getContext';
import omitProps from 'recompact/omitProps';

export default (handlerName) => (Target) => {
  const FieldValidation = (props) => (
    <Target {...props}/>
  );

  return compose(
    setPropTypes({
      name: PropTypes.string.isRequired,
      validator: PropTypes.func
    }),
    getContext({
      neoform: PropTypes.object
    }),
    withState('validation', 'setValidation', {}),
    withProps(
      ({ neoform, name, value, validation, setValidation, validator }) => ({
        validate: () => {
          if (!validator) {
            return;
          }

          return validator(value)
            .then((message) => {
              setValidation({
                status: true,
                message
              });

              // FIXME
              neoform.markValid(name);
            })
            .catch((message) => {
              setValidation({
                status: false,
                message
              });

              // FIXME
              neoform.markInvalid(name);
            });
        },
        validationStatus: validation.status,
        validationMessage: validation.message
      })
    ),
    lifecycle({
      componentDidMount() {
        if (this.props.validator) {
          this.props.neoform.registerValidator(() => this.props.validate());
        }
      }
    }),
    withHandlers({
      [handlerName]: ({ validate, ...props }) => (...args) => {
        validate();

        const externalHandler = props[handlerName];

        if (typeof externalHandler === 'function') {
          externalHandler(...args);
        }
      }
    }),
    omitProps([ 'neoform', 'validator', 'validate', 'validation', 'setValidation' ])
  )(FieldValidation);
};
