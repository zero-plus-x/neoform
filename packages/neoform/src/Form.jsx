import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompact/compose';
import setPropTypes from 'recompact/setPropTypes';
import withContext from 'recompact/withContext';

export default (Target) => {
  const Form = (props) => (
    <Target {...props}/>
  );

  return compose(
    setPropTypes({
      data: PropTypes.object.isRequired,
      getValue: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired
    }),
    withContext(
      {
        neoform: PropTypes.object
      },
      ({ data, getValue, onChange }) => ({
        neoform: {
          state: data,
          updateData: onChange,
          getValue: (name) => getValue(data, name)
        }
      })
    )
  )(Form);
};
