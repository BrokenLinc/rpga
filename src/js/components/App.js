import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../redux';
import Router from './Router';
import AuthConnector from './AuthConnector';

const App = () => {
  return (
    <Provider store={ store }>
      <AuthConnector>
        <Router/>
      </AuthConnector>
    </Provider>
  );
}

export default App;
