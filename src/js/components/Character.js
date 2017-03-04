import { assign, each, filter, map } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import base from '../base';
import { characterSpec } from '../specs';
import Inventory from './Inventory';
import PaperDoll from './PaperDoll';
import Portrait from './Portrait';

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

    this.ref = base.bindToState(`users/${uid}/characters/${characterKey}`, {
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
    const { uid } = this.context.user;
    const { characterKey } = this.props.params;
    const { character, isLoading, wins, draws, losses } = this.state;
    const { imageFile, name, power } = characterSpec(character);

    if(isLoading) return null;

    return (
      <div>
        <PaperDoll uid={uid} characterKey={characterKey}/><br/>
        <Inventory uid={uid} characterKey={characterKey}/>
        <h1>{ name }</h1>
        <Portrait imageFile={imageFile} className="is-large" />
      </div>
    );
  }
}

Character.contextTypes = {
  user: PropTypes.object.isRequired,
};

export default Character;
