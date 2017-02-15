import React, { PropTypes } from 'react';
import compose from 'recompact/compose';
import setPropTypes from 'recompact/setPropTypes';
import withContext from 'recompact/withContext';

export default (getValue) => (Target) => {
  const Form = (props) => (
    <Target {...props}/>
  );

  return compose(
    setPropTypes({
      data: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired
    }),
    withContext(
      {
        neoform: PropTypes.object
      },
      ({ data, onChange }) => ({
        neoform: {
          state: data,
          updateData: onChange,
          getValue: (name) => getValue(data, name)
        }
      })
    )
  )(Form);
};
