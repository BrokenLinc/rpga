import { map } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CharacterItem from './CharacterItem';

class CharacterItemList extends Component {
  render() {
    const { character } = this.props;
    const { items } = character;

    return (
      <div>
        {map(items, (item) => (
          <CharacterItem key={item.key} character={character} item={item} />
        ))}
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
