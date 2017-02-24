import React from 'react';
import { mount } from 'enzyme';

import DemoApp from '~/neoform/demo/App';
import data from '~/neoform/demo/data.json';

describe('Form', () => {
  it('basic wrapper', () => {
    const wrapper = mount(
      <DemoApp data={data}/>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('change field', () => {
    const wrapper = mount(
      <DemoApp data={data}/>
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
