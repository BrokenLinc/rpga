import { map } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Item } from 'semantic-ui-react';

import CharacterItem from './CharacterItem';

class CharacterItemList extends Component {
  render() {
    const { character } = this.props;
    const { items } = character;

    return (
      <div style={{textAlign:'left'}}>
        <Item.Group>
          {map(items, (item) => (
            <CharacterItem key={item.key} character={character} item={item} />
          ))}
        </Item.Group>
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
