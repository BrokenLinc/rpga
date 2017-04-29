import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react'
import cn from 'classnames';

import gameFunctions from '../gameFunctions';

class CharacterItem extends Component {
  toggleEquip = (item) => {
    const { user } = this.context;
    const { character } = this.props;
    gameFunctions.toggleEquip(user, character, item);
  }
  trash = (item) => {
    const { user } = this.context;
    const { character } = this.props;
    gameFunctions.trashItem(user, character, item);
  }
  render() {
    const { item } = this.props;
    const { name, type, combat, combatAction, isEquipped } = item;

    return (
      <div className={cn('characteritem', {'is-equipped':isEquipped})}>
        <div className="characteritem__info">
          <div className="characteritem__name">{ name }</div>
          <div className="characteritem__type">{ type }</div>
          <div className="characteritem__combat">{ `${combat} ${combatAction}` }</div>
        </div>
        <button className="characteritem__trash" onClick={ () => this.trash(item) }>
          <Icon name="trash" fitted />
        </button>
        <button className="characteritem__toggle" onClick={ () => this.toggleEquip(item) }>
          <Icon name="check" fitted />
        </button>
      </div>
    );
  }
}

CharacterItem.contextTypes = {
  user: PropTypes.object.isRequired,
};

CharacterItem.propTypes = {
  character: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default CharacterItem;
