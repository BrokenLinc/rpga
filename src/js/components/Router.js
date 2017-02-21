import React from 'react';
import { Router, Route, hashHistory } from 'react-router'

import restrictAccess from '../restrictAccess';
import Dashboard from './Dashboard';
import Character from './Character';
import CharacterCreate from './CharacterCreate';
import Characters from './Characters';
import PageTemplate from './PageTemplate';

const AppRouter = () => {
  return (
    <Router history={hashHistory}>
      <Route component={PageTemplate}>
        <Route path="/" component={restrictAccess(Dashboard)}/>
        <Route path="/characters" component={restrictAccess(Characters)}/>
        <Route path="/characters/create" component={restrictAccess(CharacterCreate)}/>
        <Route path="/characters/:characterKey" component={restrictAccess(Character)}/>
      </Route>
    </Router>
  );
}

export default AppRouter;
