import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompact/compose';
import withHandlers from 'recompact/withHandlers';
import getContext from 'recompact/getContext';
import withProps from 'recompact/withProps';
import lifecycle from 'recompact/lifecycle';
import omitProps from 'recompact/omitProps';

export default (Target) => {
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
      },
      componentWillUnmount() {
        const { neoform, name, validator } = this.props;

        if (validator) {
          neoform.unregisterValidator(name);
        }
      }
    }),
    withHandlers({
      validate: ({ neoform, name, validator }) => () => {
        if (validator) {
          neoform.validate(name);
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
