import React from 'react';
import { mount } from 'enzyme';

import Demo from '../demo';

describe('neoform-validation', () => {
  it('basic wrapper', () => {
    const wrapper = mount(
      <Demo/>
    );

    expect(wrapper).toMatchSnapshot();
  });

  describe('validate field', () => {
    it('valid', () => {
      const wrapper = mount(
        <Demo/>
      );
      const firstName = wrapper.findWhere((node) => node.getDOMNode().name === 'friends.1.firstName');

      firstName.simulate('change', {
        target: {
          value: 'Alone'
        }
      });
      firstName.simulate('blur');

      return new Promise((resolve) => {
        // FIXME
        global.setImmediate(() => {
          expect(wrapper).toMatchSnapshot();
          resolve();
        });
      });
    });

    it('invalid', () => {
      const wrapper = mount(
        <Demo/>
      );
      const firstName = wrapper.findWhere((node) => node.getDOMNode().name === 'friends.1.firstName');

      firstName.simulate('blur');

      return new Promise((resolve) => {
        // FIXME
        global.setImmediate(() => {
          expect(wrapper).toMatchSnapshot();
          resolve();
        });
      });
    });

    it('without validator', () => {
      const wrapper = mount(
        <Demo/>
      );
      const country = wrapper.find('[name="country"]');

      country.simulate('blur');

      return new Promise((resolve) => {
        // FIXME
        global.setImmediate(() => {
          expect(wrapper).toMatchSnapshot();
          resolve();
        });
      });
    });

    it('unmount invalid field', () => {
      const wrapper = mount(
        <Demo/>
      );
      const firstName = wrapper.findWhere((node) => node.getDOMNode().name === 'friends.1.firstName');

      return new Promise((resolve) => {
        firstName.simulate('blur');

        global.setImmediate(() => {
          wrapper.setState({
            friends: [
              {
                firstName: 'Pepe',
                lastName: 'Sad'
              }
            ]
          }, () => {
            expect(wrapper).toMatchSnapshot();
            resolve();
          });
        })
      });
    });

    it('unmount field without validator', () => {
      const wrapper = mount(
        <Demo/>
      );
      const firstName = wrapper.findWhere((node) => node.getDOMNode().name === 'friends.1.firstName');

      firstName.simulate('blur');

      return new Promise((resolve) => {
        wrapper.setState({
          friends: [
            {
              firstName: 'Sad',
              lastName: 'Pepe'
            }
          ]
        }, () => {
          expect(wrapper).toMatchSnapshot();
          resolve();
        });
      });
    });
  });

  describe('validate form', () => {
    it('valid', () => {
      const mockOnSubmit = jest.fn();
      const wrapper = mount(
        <Demo

          onSubmit={mockOnSubmit}
        />
      );
      const firstName = wrapper.findWhere((node) => node.getDOMNode().name === 'friends.1.firstName');
      const form = wrapper.find('form');

      firstName.simulate('change', {
        target: {
          value: 'Alone'
        }
      });
      form.simulate('submit');

      return new Promise((resolve) => {
        // FIXME
        global.setImmediate(() => {
          expect(wrapper).toMatchSnapshot();
          expect(mockOnSubmit).toHaveBeenCalledTimes(1);
          resolve();
        });
      });
    });

    it('invalid', () => {
      const mockOnInvalid = jest.fn();
      const wrapper = mount(
        <Demo

          onInvalid={mockOnInvalid}
        />
      );
      const form = wrapper.find('form');

      form.simulate('submit');

      return new Promise((resolve) => {
        // FIXME
        global.setImmediate(() => {
          expect(wrapper).toMatchSnapshot();
          expect(mockOnInvalid).toHaveBeenCalledTimes(1);
          resolve();
        });
      });
    });

    it('unmount invalid field', () => {
      const mockOnSubmit = jest.fn();
      const wrapper = mount(
        <Demo

          onSubmit={mockOnSubmit}
        />
      );
      const form = wrapper.find('form');

      wrapper.setState({
        friends: [
          {
            firstName: 'Sad',
            lastName: 'Pepe'
          }
        ]
      });
      form.simulate('submit');

      return new Promise((resolve) => {
        // FIXME
        global.setImmediate(() => {
          expect(wrapper).toMatchSnapshot();
          expect(mockOnSubmit).toHaveBeenCalledTimes(1);
          resolve();
        });
      });
    });
  });
});
