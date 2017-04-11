import { map, times } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import base from '../base';
import paths from '../paths';
import ContentLoader from './ContentLoader';
import CharacterThumb from './CharacterThumb';

const MAX_CHARACTERS = 5;

class Characters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: [],
      isLoading: true,
    };
  }
  componentDidMount(){
    const { uid } = this.context.user;

    this.ref = base.bindToState(`users/${uid}/characters`, {
      context: this,
      state: 'characters',
      asArray: true,
      keepKeys: true,
      then: () => {
        this.setState({ isLoading: false });
      },
    });
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  render() {
    const { characters, isLoading } = this.state;
    const emptyslotCount = Math.max(MAX_CHARACTERS - characters.length, 0);

    return (
      <div className="characters scrollable">
        <ContentLoader isLoading={isLoading} align="center">
          <ul className="characterlist">
            {map(characters, (character) => (
              <li key={character.key}>
                <Link to={ paths.characterTab(character.key, 'items') } className="characterlistitem">
                  <CharacterThumb character={character}/>
                </Link>
              </li>
            ))}
            {times(emptyslotCount, (index) => (
              <li key={index}>
                {index === 0 ? (
                  <Link to={ paths.characterCreate() } className="characterlistitem">
                    + New Character
                  </Link>
                ) : (
                  <div className="characterlistitem">
                    ...
                  </div>
                )}
              </li>
            ))}
          </ul>
        </ContentLoader>
      </div>
    );
  }
}

Characters.contextTypes = {
  user: PropTypes.object.isRequired,
};

export default Characters
