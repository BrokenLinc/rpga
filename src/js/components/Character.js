import { assign } from 'lodash';
import React, { Component, PropTypes } from 'react';

import base from '../base';
import { characterSpec } from '../specs';

class Character extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      isLoading: true,
    };
  }
  componentDidMount(){
    const { uid } = this.context.user;
    const { characterKey } = this.props.params;

    this.ref = base.syncState(`users/${uid}/characters/${characterKey}`, {
      context: this,
      state: 'character',
      then: () => {
        this.setState({isLoading: false})
      },
    });
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  render() {
    const { character, isLoading } = this.state;
    const { name, power } = characterSpec(character);

    if(isLoading) return null;

    return (
      <div>
        <h1>{ name }</h1>
        <p>{ power } power</p>
      </div>
    );
  }
}

Character.contextTypes = {
  user: PropTypes.object.isRequired,
};

export default Character
