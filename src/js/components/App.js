import React from 'react';
import { Provider } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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

export default DragDropContext(HTML5Backend)(App);
