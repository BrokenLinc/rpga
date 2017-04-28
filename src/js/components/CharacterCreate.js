import { assign } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Button } from 'semantic-ui-react';
import cn from 'classnames';

import base from '../base';
import paths from '../paths';
import { generateCharacter } from '../gameFunctions';
import Portrait from './Portrait';

class CharacterCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: generateCharacter(),
    };

    this.rollCharacter = this.rollCharacter.bind(this);
    this.keepCharacter = this.keepCharacter.bind(this);
  }
  rollCharacter() {
    this.setState({
      character: generateCharacter(),
    });
  }
  keepCharacter() {
    const { router } = this.context;
    const { uid } = this.context.user;

    base.push(`users/${uid}/characters`, {
      data: this.state.character,
    }).then(newLocation => {
      router.push(paths.character(newLocation.key));
    }).catch((error) => {
      this.setState({ error });
    });
    event.preventDefault();
  }
  render() {
    const { name, imageFile } = this.state.character;

    return (
      <div>
        <h1>New Character</h1>

        <div>{ name }</div>
        <Portrait imageFile={imageFile} />

        <Button onClick={ this.rollCharacter }>Re-roll</Button>
        <Button onClick={ this.keepCharacter }>Keep</Button>
    </div>
    );
  }
}

CharacterCreate.contextTypes = {
  router: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default CharacterCreate
