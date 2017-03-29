import { map, times } from 'lodash';
import React, { Component, PropTypes } from 'react';

import { getFullCharacter } from '../utils';
import Portrait from './Portrait';

class CharacterThumb extends Component {
  render() {
    const { character } = this.props;
    const { imageFile, name, life, attack, defense, combat } = getFullCharacter(character);

    return (
      <div className="characterthumb">
        <div className="characterthumb__portrait">
          <Portrait imageFile={imageFile} />
        </div>
        <div className="characterthumb__info">
          <div className="characterthumb__name">{ name }</div>
          <div className="characterthumb__health">
            <div className="lifebar">
              {times(life, (i) => (<i key={i} className="zmdi zmdi-favorite"></i>))}
              {times(5 - life, (i) => (<i key={life + i} className="zmdi zmdi-favorite-outline"></i>))}
            </div>
          </div>
          <div className="characterthumb__stats">
            {attack} attack / {defense} defense
          </div>
        </div>
      </div>
    );
  }
}

CharacterThumb.propTypes = {
  character: PropTypes.object.isRequired,
};

export default CharacterThumb;
