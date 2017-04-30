import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Icon, Label, Modal, Popup } from 'semantic-ui-react'
import cn from 'classnames';
import { Link } from 'react-router';

import paths from '../paths';
import gameFunctions from '../gameFunctions';

class CharacterItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
    };
  }
  toggle = () => {
    this.setState({ isActive: !this.state.isActive });
  }
  toggleEquip = () => {
    const { user } = this.context;
    const { character, item } = this.props;
    gameFunctions.toggleEquip(user, character, item);
  }
  trash = () => {
    const { user } = this.context;
    const { character, item } = this.props;
    gameFunctions.trashItem(user, character, item);
  }
  render() {
    const { isActive } = this.state;
    const { character, item } = this.props;
    const { name, type, combat, combatAction, isEquipped, imageFile } = item;

    const block = (
      <div className="characteritem">
        <button className="characteritem__content" onClick={this.toggle}>
          <div className="characteritem__image">
            <img src={paths.itemImage(imageFile)} />
          </div>
          <div className="characteritem__info">
            <h4>{ name }</h4>
            <div>
              <Label color={combatAction === 'attack' ? 'pink' : 'blue'} basic={!isEquipped}>
                { isEquipped && <Icon name="check" /> }
                { `${combat} ${combatAction}` }
                <Label.Detail>{ type }</Label.Detail>
              </Label>
            </div>
          </div>
        </button>
        <Modal basic open={isActive}>
          <Modal.Content>
            <div className="cardflipper">
              <Card
                image={paths.itemImage(imageFile)}
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button inverted circular icon size="big" color="red">
              <Icon name="trash" />
            </Button>
            <Button inverted circular icon size="big" color="green">
              <Icon name="checkmark" />
            </Button>
            <Button inverted circular icon size="big" onClick={this.toggle}>
              <Icon name="close" />
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );

    return block;
  }
}

CharacterItem.contextTypes = {
  user: PropTypes.object.isRequired,
};

CharacterItem.propTypes = {
  character: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default CharacterItem;
