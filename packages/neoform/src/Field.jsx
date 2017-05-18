import React, { PropTypes } from 'react';
import compose from 'recompact/compose';
import setPropTypes from 'recompact/setPropTypes';
import getContext from 'recompact/getContext';
import withHandlers from 'recompact/withHandlers';
import withProps from 'recompact/withProps';
import omitProps from 'recompact/omitProps';

export default (onChangeHandler) => (Target) => {
  const Field = (props) => (
    <Target {...props}/>
  );

  return compose(
    setPropTypes({
      name: PropTypes.string.isRequired
    }),
    getContext({
      neoform: PropTypes.object
    }),
    withHandlers({
      onChange: ({ neoform, name }) => (...args) => {
        const value = onChangeHandler(...args);

        neoform.updateData(name, value);
      }
    }),
    withProps(
      ({ neoform, name, defaultValue }) => {
        const dataValue = neoform.getValue(name);
        const value = typeof dataValue === 'undefined' ? defaultValue : dataValue;

        return { value };
      }
    ),
    omitProps([ 'neoform', 'defaultValue' ])
  )(Field);
};
