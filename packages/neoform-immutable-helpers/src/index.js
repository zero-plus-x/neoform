import memoize from 'lodash.memoize';

const makeKeyPath = memoize(
  (name) => name.replace(/\[(\d+)\]/, '.$1').split('.')
);

export const getByFieldName = (target, name) => target.getIn(
  makeKeyPath(name)
);

export const setByFieldName = (target, name, value) => target.setIn(
  makeKeyPath(name),
  value
);
