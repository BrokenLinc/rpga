import { find, map } from 'lodash';
import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

import base from '../base';
import Icon from './Icon';

class CharacterItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      items: [],
    };

    this.toggleEquip = this.toggleEquip.bind(this);
    this.trash = this.trash.bind(this);
  }
  componentDidMount(){
    const { uid } = this.context.user;
    const { character } = this.props;

    // Use listenTo so it can be reversed on the way to state
    this.ref = base.listenTo(`users/${uid}/characters/${character.key}/items`, {
      context: this,
      asArray: true,
      keepKeys: true,
      queries: {
        orderByChild: 'combat',
      },
      then: (items) => {
        this.setState({
          items: items.reverse(),
          isLoading: false
        })
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
    const { character } = this.props;
    if(item.isEquipped) {
      //unequip item
      base.remove(`users/${uid}/characters/${character.key}/items/${item.key}/isEquipped`);
    } else {
      // unequip old item
      const oldItem = this.getEquippedItem(item.type);
      if(oldItem) {
        base.remove(`users/${uid}/characters/${character.key}/items/${oldItem.key}/isEquipped`);
      }
      // equip item
      base.update(`users/${uid}/characters/${character.key}/items/${item.key}`, {
        data: { isEquipped: true }
      });
    }
  }
  trash(item) {
    const { uid } = this.context.user;
    const { character } = this.props;
    base.remove(`users/${uid}/characters/${character.key}/items/${item.key}`);
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
                <div className="characteritem__combat">{ `${combat} ${combatAction}` }</div>
              </div>
              <button className="characteritem__trash" onClick={ () => this.trash(item) }>
                <Icon name="trash" />
              </button>
              <button className="characteritem__toggle" onClick={ () => this.toggleEquip(item) }>
                <Icon name="check" />
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
};

export default CharacterItemList;
