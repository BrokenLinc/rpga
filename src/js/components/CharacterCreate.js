import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

import base from '../base';

class CharacterCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      name: '',
      error: null,
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onAddFormSubmit = this.onAddFormSubmit.bind(this);
  }
  onNameChange(event) {
    this.setState({ name: event.target.value });
  }
  onAddFormSubmit(event) {
    const { router } = this.context;
    const { uid } = this.context.user;
    const { name } = this.state;

    this.setState({ error: '' });

    base.push(`users/${uid}/characters`, {
      data: { uid, name },
    }).then(newLocation => {
      this.setState({ name: '' });
      router.push(`/characters`);
    }).catch((error) => {
      this.setState({ error });
    });
    event.preventDefault();
  }
  render() {
    const { name, error, isLoading } = this.state;

    return (
      <div>
        <h1>New Character</h1>

        <form onSubmit={ this.onAddFormSubmit } className={cn('form', {'is-error':error})}>
          <div className="form-group">
            <label>Character Name</label>
            <input type="text" value={ name } onChange={ this.onNameChange } className="form-control" autoFocus />
          </div>
          <button className="btn btn-default">Create</button>
        </form>
    </div>
    );
  }
}

CharacterCreate.contextTypes = {
  router: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default CharacterCreate
