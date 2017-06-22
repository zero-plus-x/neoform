import React, { PropTypes } from 'react';
import compose from 'recompact/compose';
import setPropTypes from 'recompact/setPropTypes';
import getContext from 'recompact/getContext';
import withProps from 'recompact/withProps';
import omitProps from 'recompact/omitProps';

export default (Target) => {
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
    withProps(
      ({ neoform, name }) => ({
        value: neoform.getValue(name),
        onChange: (value) => neoform.updateData(name, value)
      })
    ),
    omitProps([ 'neoform' ])
  )(Field);
};
