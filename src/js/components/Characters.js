import { map } from 'lodash';
import React, { Component, PropTypes } from 'react';

import base from '../base';

class Characters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: [],
      isLoading: true,
      name: '',
    }

    this.onNameChange = this.onNameChange.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
  }
  componentDidMount(){
    const { uid } = this.context.user;

    this.ref = base.syncState(`users/${uid}/characters`, {
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
  onNameChange(event) {
    this.setState({ name: event.target.value });
  }
  onAddClick(event) {
    const { uid } = this.context.user;
    const { name } = this.state;

    base.push(`users/${uid}/characters`, {
      data: { uid, name },
      then: (err) => {
        if(!err){
          // handle
        }
      },
    });
    event.preventDefault();
  }
  render() {
    const { characters, isLoading } = this.state;

    return (
      <div>
        <h1>Characters</h1>
        <ul>
          {map(characters, ({ name }, i) => (
            <li key={i}>{ name }</li>
          ))}
        </ul>
        <input type="text" value={ this.state.name } onChange={ this.onNameChange } className="form-control" placeholder="Name" />
        <button onClick={ this.onAddClick } className="btn btn-default">Add</button>
      </div>
    );
  }
}

Characters.contextTypes = {
  user: PropTypes.object.isRequired,
};

export default Characters;
