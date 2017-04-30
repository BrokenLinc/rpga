import { times } from 'lodash';
// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Rating } from 'semantic-ui-react'

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
          <h4 className="characterthumb__name">{ name }</h4>
          <div className="characterthumb__health">
            <Rating disabled icon="heart" rating={life} maxRating={5} />
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
