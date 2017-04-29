import { assign, map, sortBy } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';

import base from '../base';
import { getFullCharacter } from '../gameFunctions';
import CharacterThumb from './CharacterThumb';
import CharacterInfoTabs from './CharacterInfoTabs';

class Character extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      isLoading: true,
    };
  }
  componentDidMount() {
    const { uid } = this.context.user;
    const { characterKey } = this.props.params;

    this.ref = base.listenTo(`users/${uid}/characters/${characterKey}`, {
      context: this,
      then: (character) => {
        this.setState({
          character: assign(
            { key: characterKey },
            getFullCharacter(character),
            { items: sortBy(map(character.items, (item, key) => assign({ key }, item)), 'combat').reverse() }
          ),
          isLoading: false
        })
      },
    });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  render() {
    const { tab } = this.props.params;
    const { character, isLoading } = this.state;

    return (
      <div className="character">
        <Dimmer active={isLoading}>
          <Loader>Loading character</Loader>
        </Dimmer>
        {character && (
          <div className="character__header">
            <CharacterThumb character={character} />
          </div>
        )}
        {character && (
          <CharacterInfoTabs character={character} initialTab={tab} />
        )}
      </div>
    );
  }
}

Character.contextTypes = {
  user: PropTypes.object.isRequired,
};

Character.propTypes = {
  params: PropTypes.object,
};

export default Character;
