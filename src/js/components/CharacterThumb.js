import { map, times } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Icon } from 'semantic-ui-react'

import Portrait from './Portrait';

class CharacterThumb extends Component {
  render() {
    const { character } = this.props;
    const { imageFile, name, life, attack, skill } = character;

    return (
      <div className="characterthumb">
        <div className="characterthumb__portrait">
          <Portrait imageFile={imageFile} />
        </div>
        <div className="characterthumb__info">
          <div className="characterthumb__name">{ name }</div>
          <div className="characterthumb__health">
            <div className="lifebar">
              {times(life, (i) => (<Icon key={i} name="heart" fitted />))}
              {times(5 - life, (i) => (<Icon key={life + i} name="empty heart" fitted />))}
            </div>
          </div>
          <div className="characterthumb__stats">
            { attack } attack / { skill.value } { skill.name }
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
