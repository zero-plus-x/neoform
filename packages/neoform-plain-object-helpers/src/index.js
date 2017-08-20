import dotProp from 'dot-prop-immutable';

export const getValue = (data, name) => dotProp.get(data, name);
export const setValue = (data, name, value) => dotProp.set(data, name, value);
