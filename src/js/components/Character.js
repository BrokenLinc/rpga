import { assign, each, filter, map } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import base from '../base';
import { characterSpec } from '../specs';
import PaperDoll from './PaperDoll';
import Inventory from './Inventory';
import Item from './Item';
import Portrait from './Portrait';

class Character extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      isLoading: true,
    };

    // this.equip = this.equip.bind(this);
    // this.unequip = this.unequip.bind(this);
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
  // unequip(itemKey) {
  //   const { uid } = this.context.user;
  //   const { characterKey } = this.props.params;
  //   base.remove(`users/${uid}/characters/${characterKey}/items/${itemKey}/slot`);
  // }
  // equip(itemKey) {
  //   const { uid } = this.context.user;
  //   const { characterKey } = this.props.params;
  //   const { character } = this.state;
  //   const { items } = character;
  //   const type = items[itemKey].type;
  //
  //   each(items, (thisItem, thisItemKey) => {
  //     if(thisItem.type === type && thisItemKey !== itemKey) {
  //       base.remove(`users/${uid}/characters/${characterKey}/items/${thisItemKey}/slot`);
  //     }
  //   });
  //
  //   base.update(`users/${uid}/characters/${characterKey}/items/${itemKey}`, {
  //     data: { slot: type }
  //   });
  // }
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
