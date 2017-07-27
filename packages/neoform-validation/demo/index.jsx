import React from 'react';
import { render } from 'react-dom';

import App from './App';
import data from './data.json';

render(
  <App
    data={data}
    onInvalid={() => console.log('invalid')}
    onSubmit={(state) => console.log('submit', state)}
  />,
  global.document.getElementById('app')
);
