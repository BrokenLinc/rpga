import { map } from 'lodash';
import React, { Component } from 'react';

import base from '../base';

class Characters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: [],
      isLoading: true,
    }
  }
  componentDidMount(){
    this.ref = base.syncState(`characters`, {
      context: this,
      state: 'characters',
      asArray: true,
      then: () => {
        this.setState({isLoading: false})
      },
    });
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  render() {
    const { characters, isLoading } = this.state;

    return (
      <div>
        <h1>Characters</h1>
        <div>Loading: { String(isLoading) }</div>
        <ul>
          {map(characters, ({ name }, i) => (
            <li key={i}>{ name }</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Characters;
