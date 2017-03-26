import { indexOf, map, nth } from 'lodash';
import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

import base from '../base';
import paths from '../paths';
import { characterImage } from '../paths';
import Portrait from './Portrait';

// Form animations requie 6 or more character images
const characterImageFiles = [
  'character1.png',
  'character2.png',
  'character3.png',
  'character4.png',
  'character5.png',
  'character6.png',
];

class CharacterCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      name: '',
      error: null,
      imageFile: characterImageFiles[0],
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onAddFormSubmit = this.onAddFormSubmit.bind(this);
    this.setImageFile = this.setImageFile.bind(this);
  }
  onNameChange(event) {
    this.setState({ name: event.target.value.substr(0,16) });
  }
  setImageFile(imageFile) {
    this.setState({ imageFile });
  }
  onAddFormSubmit(event) {
    const { router } = this.context;
    const { uid } = this.context.user;
    const { name, imageFile } = this.state;

    this.setState({ error: '' });

    base.push(`users/${uid}/characters`, {
      data: { name, imageFile },
    }).then(newLocation => {
      this.setState({ name: '' });
      router.push(paths.characters());
    }).catch((error) => {
      this.setState({ error });
    });
    event.preventDefault();
  }
  render() {
    const { name, imageFile, error, isLoading } = this.state;

    const imagesToShow = [];
    const startingIndex = indexOf(characterImageFiles, imageFile);

    for(var i = startingIndex - 2; i <= startingIndex + 2; i++) {
      const thisImageFile = nth(characterImageFiles, i % characterImageFiles.length);
      imagesToShow.push(thisImageFile);
    }

    return (
      <div>
        <h1>New Character</h1>

        <form onSubmit={ this.onAddFormSubmit } className={cn('form', {'is-error':error})}>
          <div className="form-group">
            <label>Character Name</label>
            <input type="text" value={ name } onChange={ this.onNameChange } className="form-control" autoFocus maxLength={16} />
          </div>
          <ul className="selectionrotator">
            {map(imagesToShow, (thisImageFile) => {
              const isActive = thisImageFile === imageFile;

              return (
                <li key={thisImageFile} onClick={ () => { this.setImageFile(thisImageFile) } }>
                  <Portrait imageFile={thisImageFile} className={cn({'is-active':isActive})} />
                </li>
              );
            })}
          </ul>
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
