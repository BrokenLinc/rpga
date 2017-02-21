import { map } from 'lodash';
import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

import base from '../base';

class Characters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: [],
      isLoading: true,
      name: '',
      error: null,
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onAddFormSubmit = this.onAddFormSubmit.bind(this);
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
  onAddFormSubmit(event) {
    const { uid } = this.context.user;
    const { name } = this.state;

    this.setState({ error: '' });

    base.push(`users/${uid}/characters`, {
      data: { uid, name },
      then: (error) => {
        if(error){
          this.setState({ error });
        } else {
          this.setState({ name: '' });
        }
      },
    });
    event.preventDefault();
  }
  render() {
    const { characters, error, isLoading } = this.state;

    return (
      <div>
        <h1>Characters</h1>
        <ul>
          {map(characters, ({ name }, i) => (
            <li key={i}>{ name }</li>
          ))}
        </ul>

        <form onSubmit={ this.onAddFormSubmit } className={cn('form', {'is-error':error})}>
          <div className="form-group">
            <label>Character Name</label>
            <input type="text" value={ this.state.name } onChange={ this.onNameChange } className="form-control"/>
          </div>
          <button className="btn btn-default">Create</button>
        </form>
    </div>
    );
  }
}

Characters.contextTypes = {
  user: PropTypes.object.isRequired,
};

export default Characters;
