import React from 'react';
import { mount } from 'enzyme';

import Demo from '../demo';

describe('neoform', () => {
  it('basic wrapper', () => {
    const wrapper = mount(
      <Demo/>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('change field', () => {
    const wrapper = mount(
      <Demo/>
    );

    const firstName = wrapper.find('[name="firstName"]');

    firstName.simulate('change', {
      target: {
        value: 'hey from tests'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });
});
