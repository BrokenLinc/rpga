import React from 'react';
import { Router, Route, hashHistory } from 'react-router'

import restrictAccess from '../restrictAccess';
import Characters from './Characters';
import SignIn from './SignIn';

const AppRouter = () => {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={SignIn}/>
      <Route path="/characters" component={restrictAccess(Characters)}/>
    </Router>
  );
}

export default AppRouter;
