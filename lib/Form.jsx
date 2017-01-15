import React, { Component, PropTypes } from 'react';
import getBySelector from 'lodash.get';

export default (Target) => {
  class Form extends Component {
    constructor(props) {
      super(props);

      this.getValue = this.getValue.bind(this);
      this.updateData = this.updateData.bind(this);
    }

    getChildContext() {
      return {
        neoform: {
          state: this.props.data,
          getValue: this.getValue,
          updateData: this.updateData
        }
      };
    }

    getValue(name) {
      return getBySelector(this.props.data, name);
    }

    updateData(name, value) {
      this.props.onChange(name, value);
    }

    render() {
      return (
        <Target {...this.props}/>
      );
    }
  }

  Form.childContextTypes = {
    neoform: PropTypes.object
  };

  Form.propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func
  };

  return Form;
};
