import dotProp from 'dot-prop-immutable';
import memoize from 'lodash.memoize';

const makeKeyPath = memoize(
  (name) => name.replace(/\[(\d+)\]/, '.$1').split('.')
);

export const getValue = (data, name) => dotProp.get(data, makeKeyPath(name));
export const setValue = (data, name, value) => dotProp.set(data, makeKeyPath(name), value);
