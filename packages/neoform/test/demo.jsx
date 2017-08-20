import React from 'react';
import { mount } from 'enzyme';

import Demo from '../demo';

describe('neoform', () => {
  it('values', () => {
    const wrapper = mount(
      <Demo/>
    );

    expect(wrapper.find('[name="firstName"]')).toMatchSnapshot();
    expect(wrapper.find('[name="lastName"]')).toMatchSnapshot();
    expect(wrapper.find('[name="friends.0.firstName"]')).toMatchSnapshot();
    expect(wrapper.find('[name="friends.0.lastName"]')).toMatchSnapshot();
    expect(wrapper.find('[name="friends.1.firstName"]')).toMatchSnapshot();
    expect(wrapper.find('[name="friends.1.lastName"]')).toMatchSnapshot();
  });

  it('change field', () => {
    const wrapper = mount(
      <Demo/>
    );

    const testField = wrapper.find('[name="firstName"]');

    testField.simulate('change', {
      target: {
        value: 'hey from tests'
      }
    });

    expect(testField).toMatchSnapshot();
  });

  it('change field in array', () => {
    const wrapper = mount(
      <Demo/>
    );

    const testField = wrapper.find('[name="friends.0.lastName"]');

    testField.simulate('change', {
      target: {
        value: 'hey from tests'
      }
    });

    expect(testField).toMatchSnapshot();
  });
});
