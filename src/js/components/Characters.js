import { assign, map, remove } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import base from '../base';
import { characterSpec } from '../specs';

class Characters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: [],
      isLoading: true,
    };

    this.deleteCharacter = this.deleteCharacter.bind(this);
  }
  componentDidMount(){
    const { uid } = this.context.user;

    this.ref = base.syncState(`users/${uid}/characters`, {
      context: this,
      state: 'characters',
      asArray: true,
      then: () => {
        this.setState({ isLoading: false });
      },
    });
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  deleteCharacter(key) {
    const { uid } = this.context.user;
    base.remove(`users/${uid}/characters/${key}`);
  }
  render() {
    const { characters, isLoading } = this.state;

    return (
      <div>
        <h1>Characters</h1>

        <ul>
          {map(characters, (character) => {
            const { key, name, power } = characterSpec(character);
            return (
              <li key={key}>
                <Link to={`/characters/${key}`}>{ name }, { power } power</Link>
                <button className="btn btn-sm btn-danger" onClick={ () => { this.deleteCharacter(key) } }>delete</button>
              </li>
            )
          })}
        </ul>
        <Link className="btn btn-default" to="/characters/create">New Character</Link>
    </div>
    );
  }
}

Characters.contextTypes = {
  user: PropTypes.object.isRequired,
};

export default Characters
