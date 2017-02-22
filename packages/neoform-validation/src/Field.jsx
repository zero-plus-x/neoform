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
      ({ name, value, setValidation, validator }) => ({
        validate() {
          if (!validator) {
            return;
          }

          return validator(value)
            .then((message) => {
              setValidation({
                status: true,
                message
              });

              return name;
            })
            .catch((message) => {
              setValidation({
                status: false,
                message
              });

              return Promise.reject(name);
            });
        }
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
      [handlerName]: ({ neoform, validator, validate, ...props }) => (...args) => {
        if (validator) {
          validate()
            .then(neoform.markValid)
            .catch(neoform.markInvalid);
        }

        const externalHandler = props[handlerName];

        if (typeof externalHandler === 'function') {
          externalHandler(...args);
        }
      }
    }),
    omitProps([ 'neoform', 'validator', 'validate', 'setValidation' ])
  )(FieldValidation);
};
