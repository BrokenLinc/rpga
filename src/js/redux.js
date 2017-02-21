//import React from 'react';
import { combineReducers, createStore } from 'redux';

const ACTIONS = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  SELECT_CHARACTER: 'SELECT_CHARACTER',
};

const actionCreators = {
  signedIn: (user) => ({ type: ACTIONS.SIGNED_IN, payload: { user } }),
  signedOut: () => ({ type: ACTIONS.SIGNED_OUT }),
  selectCharacter: (key) => ({ type: ACTIONS.SELECT_CHARACTER, payload: { key } }),
};

const selectedCharacterKeyReducer = (state = null, action) => {
  switch (action.type) {
  case ACTIONS.SELECT_CHARACTER:
    return action.payload.key;
  default:
    return state;
  }
}

const userReducer = (state = { isLoading: true }, action) => {
  switch (action.type) {
  case ACTIONS.SIGNED_IN:
    return action.payload.user;
  case ACTIONS.SIGNED_OUT:
    return { };
  default:
    return state;
  }
};

const reducer = combineReducers({
  selectedCharacterKey: selectedCharacterKeyReducer,
  user: userReducer,
});

const store = createStore(reducer);

module.exports = {
  actionCreators,
  store,
};
