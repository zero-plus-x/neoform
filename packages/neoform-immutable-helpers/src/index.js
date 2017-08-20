export const getValue = (target, name) => target.getIn(name.split('.'));
export const setValue = (target, name, value) => target.setIn(name.split('.'), value);
