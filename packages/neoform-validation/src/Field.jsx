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
        this.props.neoform.registerField(this.props.name);
      }
    }),
    withHandlers({
      [handlerName]: ({ neoform, name, value, ...props }) => (...args) => {
        neoform.validate(name, value);

        const externalHandler = props[handlerName];

        if (typeof externalHandler === 'function') {
          externalHandler(...args);
        }
      }
    }),
    withProps(
      ({ neoform, name }) => ({
        validation: neoform.getValidation(name)
      })
    ),
    omitProps([ 'neoform' ])
  )(FieldValidation);
};
