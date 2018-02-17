import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { setDisplayName, wrapDisplayName } from 'recompose';

const form = (Target) => {
  class Form extends Component {
    getChildContext() {
      const { data, getValue, onChange } = this.props;

      return {
        neoform: {
          state: data,
          updateData: onChange,
          getValue: (name) => getValue(data, name)
        }
      };
    }

    render() {
      return createElement(Target, this.props);
    }
  }

  Form.propTypes = {
    data: PropTypes.object.isRequired,
    getValue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  Form.childContextTypes = {
    neoform: PropTypes.object
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(Target, 'form'))(Form);
  }

  return Form;
};

export default form;
