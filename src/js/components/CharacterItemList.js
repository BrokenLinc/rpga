import { find, map } from 'lodash';
import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

import base from '../base';

class CharacterItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      items: [],
    };

    this.toggleEquip = this.toggleEquip.bind(this);
  }
  componentDidMount(){
    const { uid } = this.context.user;
    const { characterKey } = this.props;

    this.ref = base.bindToState(`users/${uid}/characters/${characterKey}/items`, {
      context: this,
      state: 'items',
      asArray: true,
      keepKeys: true,
      queries: {
        orderByChild: 'type',
      },
      then: () => {
        this.setState({isLoading: false})
      },
    });
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  getEquippedItem(type) {
    return find(this.state.items, { type, isEquipped: true });
  }
  toggleEquip(item) {
    const { uid } = this.context.user;
    const { characterKey } = this.props;
    if(item.isEquipped) {
      //unequip item
      base.remove(`users/${uid}/characters/${characterKey}/items/${item.key}/isEquipped`);
    } else {
      // unequip old item
      const oldItem = this.getEquippedItem(item.type);
      if(oldItem) {
        base.remove(`users/${uid}/characters/${characterKey}/items/${oldItem.key}/isEquipped`);
      }
      // equip item
      base.update(`users/${uid}/characters/${characterKey}/items/${item.key}`, {
        data: { isEquipped: true }
      });
    }
  }
  render() {
    const { items } = this.state;

    return (
      <div className="characteritemlist">
        {map(items, (item) => {
          const { key, name, type, combat, combatAction, isEquipped } = item;
          return (
            <div key={key} className={cn('characteritem', {'is-equipped':isEquipped})}>
              <div className="characteritem__info">
                <div className="characteritem__name">{ name }</div>
                <div className="characteritem__type">{ type }</div>
                <div className="characteritem__combat">{ `+${combat} ${combatAction}` }</div>
              </div>
              <button className="characteritem__toggle" onClick={ () => this.toggleEquip(item) }>
                { isEquipped ? 'R' : 'E' }
              </button>
            </div>
          )
        })}
      </div>
    );
  }
}

CharacterItemList.contextTypes = {
  user: PropTypes.object.isRequired,
};

CharacterItemList.propTypes = {
  character: PropTypes.object.isRequired,
  characterKey: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default CharacterItemList;
