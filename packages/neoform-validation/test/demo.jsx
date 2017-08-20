/* eslint-disable max-len */
import React from 'react';
import { mount } from 'enzyme';

import Demo from '../demo';

describe('neoform-validation', () => {
  describe('field', () => {
    it('invalid', (done) => {
      const wrapper = mount(
        <Demo/>
      );

      const testField = wrapper
        .find('MyInput')
        .filterWhere((node) => node.prop('name') === 'friends.1.firstName');

      testField.prop('validate')();

      global.setImmediate(() => {
        expect(wrapper.find('MyForm').props()).toMatchSnapshot();
        expect(testField.props()).toMatchSnapshot();
        done();
      });
    });

    it('valid', (done) => {
      const wrapper = mount(
        <Demo/>
      );

      const testField = wrapper
        .find('MyInput')
        .filterWhere((node) => node.prop('name') === 'friends.1.firstName');

      testField.prop('onChange')('hey from test');
      testField.prop('validate')();

      global.setImmediate(() => {
        expect(wrapper.find('MyForm').props()).toMatchSnapshot();
        expect(testField.props()).toMatchSnapshot();
        done();
      });
    });

    it('without validator', (done) => {
      const wrapper = mount(
        <Demo/>
      );

      const testField = wrapper
        .find('MyInput')
        .filterWhere((node) => node.prop('name') === 'friends.1.lastName');

      testField.prop('validate')();

      global.setImmediate(() => {
        expect(wrapper.find('MyForm').props()).toMatchSnapshot();
        expect(testField.props()).toMatchSnapshot();
        done();
      });
    });

    it('unmount invalid field', (done) => {
      const wrapper = mount(
        <Demo/>
      );

      const testField = wrapper
        .find('MyInput')
        .filterWhere((node) => node.prop('name') === 'friends.1.firstName');

      testField.prop('validate')();

      global.setImmediate(() => {
        wrapper.setState({
          friends: [
            {
              firstName: 'Pepe',
              lastName: 'Sad'
            }
          ]
        }, () => {
          global.setTimeout(() => {
            expect(wrapper.find('MyForm').props()).toMatchSnapshot();
            done();
          }, 100);
        });
      });
    });
  });

  describe('form', () => {
    it('invalid', (done) => {
      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      const wrapper = mount(
        <Demo/>
      );
      const form = wrapper.find('MyForm');

      form.prop('validate')(mockOnSuccess, mockOnError);

      global.setImmediate(() => {
        const testField = wrapper
          .find('MyInput')
          .filterWhere((node) => node.prop('name') === 'friends.1.firstName');

        expect(testField.props()).toMatchSnapshot();
        expect(form.props()).toMatchSnapshot();
        expect(mockOnSuccess).toHaveBeenCalledTimes(0);
        expect(mockOnError).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('valid', (done) => {
      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      const wrapper = mount(
        <Demo/>
      );
      const form = wrapper.find('MyForm');
      const testField = wrapper
        .find('MyInput')
        .filterWhere((node) => node.prop('name') === 'friends.1.firstName');

      testField.prop('onChange')('hey from test');
      form.prop('validate')(mockOnSuccess, mockOnError);

      global.setImmediate(() => {
        expect(testField.props()).toMatchSnapshot();
        expect(form.props()).toMatchSnapshot();
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledTimes(0);
        done();
      });
    });
  });
});
