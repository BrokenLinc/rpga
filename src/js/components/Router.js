import React from 'react';
import { Router, Route, hashHistory } from 'react-router'

import restrictAccess from '../restrictAccess';
import Dashboard from './Dashboard';
import Characters from './Characters';
import PageTemplate from './PageTemplate';

const AppRouter = () => {
  return (
    <Router history={hashHistory}>
      <Route component={PageTemplate}>
        <Route path="/" component={restrictAccess(Dashboard)}/>
        <Route path="/characters" component={restrictAccess(Characters)}/>
      </Route>
    </Router>
  );
}

export default AppRouter;
