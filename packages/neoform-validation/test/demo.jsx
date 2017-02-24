import React from 'react';
import { mount } from 'enzyme';

import DemoApp from '~/neoform-validation/demo/App';
import data from '~/neoform-validation/demo/data.json';

describe('neoform-validation', () => {
  it('basic wrapper', () => {
    const wrapper = mount(
      <DemoApp data={data}/>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('validate field -> valid', () => {
    const wrapper = mount(
      <DemoApp data={data}/>
    );
    const firstName = wrapper.find('[name="firstName"]');

    firstName.simulate('change', {
      target: {
        value: 'hey from tests'
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

  it('validate field -> invalid', () => {
    const wrapper = mount(
      <DemoApp data={data}/>
    );
    const firstName = wrapper.find('[name="firstName"]');

    firstName.simulate('blur');

    return new Promise((resolve) => {
      // FIXME
      global.setImmediate(() => {
        expect(wrapper).toMatchSnapshot();
        resolve();
      });
    });
  });

  it('validate field without validator', () => {
    const wrapper = mount(
      <DemoApp data={data}/>
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

  it('validate form -> valid', () => {
    const wrapper = mount(
      <DemoApp data={data}/>
    );
    const firstName = wrapper.find('[name="firstName"]');
    const lastName = wrapper.find('[name="lastName"]');
    const form = wrapper.find('form');

    firstName.simulate('change', {
      target: {
        value: 'hey from tests'
      }
    });
    lastName.simulate('change', {
      target: {
        value: 'hey from tests 2'
      }
    });
    form.simulate('submit');

    return new Promise((resolve) => {
      // FIXME
      global.setImmediate(() => {
        expect(wrapper).toMatchSnapshot();
        resolve();
      });
    });
  });

  it('validate form -> invalid', () => {
    const wrapper = mount(
      <DemoApp data={data}/>
    );
    const firstName = wrapper.find('form');

    firstName.simulate('submit');

    return new Promise((resolve) => {
      // FIXME
      global.setImmediate(() => {
        expect(wrapper).toMatchSnapshot();
        resolve();
      });
    });
  });
});
