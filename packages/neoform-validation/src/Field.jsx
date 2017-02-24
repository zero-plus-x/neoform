import React, { PropTypes } from 'react';
import compose from 'recompact/compose';
import withHandlers from 'recompact/withHandlers';
import getContext from 'recompact/getContext';
import withProps from 'recompact/withProps';
import lifecycle from 'recompact/lifecycle';
import omitProps from 'recompact/omitProps';

export default (handlerName) => (Target) => {
  const FieldValidation = (props) => (
    <Target {...props}/>
  );

  return compose(
    getContext({
      neoform: PropTypes.object
    }),
    lifecycle({
      componentDidMount() {
        const { neoform, name, validator } = this.props;

        if (validator) {
          neoform.registerValidator(name, validator);
        }
      }
    }),
    withHandlers({
      [handlerName]: ({ neoform, name, ...props }) => (...args) => {
        neoform.validate(name);

        const externalHandler = props[handlerName];

        if (typeof externalHandler === 'function') {
          externalHandler(...args);
        }
      }
    }),
    withProps(
      ({ neoform, name }) => {
        const validation = neoform.getValidation(name);

        return {
          validationStatus: validation.status,
          validationMessage: validation.message
        };
      }
    ),
    omitProps([ 'neoform', 'validator' ])
  )(FieldValidation);
};
