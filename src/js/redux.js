//import React from 'react';
import { combineReducers, createStore } from 'redux';

const ACTIONS = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
};

const actionCreators = {
  signedIn: (user) => ({ type: ACTIONS.SIGNED_IN, payload: { user } }),
  signedOut: () => ({ type: ACTIONS.SIGNED_OUT }),
};

const userReducer = (state = {}, action) => {
  switch (action.type) {
  case ACTIONS.SIGNED_IN:
    return action.payload.user;
  case ACTIONS.SIGNED_OUT:
    return {};
  default:
    return state;
  }
};

const reducer = combineReducers({
  user: userReducer,
});

const store = createStore(reducer);

module.exports = {
  actionCreators,
  store,
};
