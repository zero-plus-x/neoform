import { Component } from 'react';
import PropTypes from 'prop-types';
import { createEagerFactory, setDisplayName, wrapDisplayName } from 'recompose';

const form = (Target) => {
  const factory = createEagerFactory(Target);

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
      return factory(this.props);
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
