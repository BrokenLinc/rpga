import { Router, Route, hashHistory } from 'react-router'

import paths from '../paths';
import restrictAccess from '../restrictAccess';
import Character from './Character';
import CharacterCreate from './CharacterCreate';
import Characters from './Characters';
import Debug from './Debug';
import PageTemplate from './PageTemplate';

const AppRouter = () => {
  return (
    <Router history={hashHistory}>
      <Route component={PageTemplate}>
        <Route path={ paths.debug() } component={restrictAccess(Debug)}/>
        <Route path={ paths.characters() } component={restrictAccess(Characters)}/>
        <Route path={ paths.characterCreate() } component={restrictAccess(CharacterCreate)}/>
        <Route path={ paths.character(':characterKey') } component={restrictAccess(Character)}/>
        <Route path={ paths.characterTab(':characterKey',':tab') } component={restrictAccess(Character)}/>
      </Route>
    </Router>
  );
}

export default AppRouter;
