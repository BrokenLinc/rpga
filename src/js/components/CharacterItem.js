// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Card, Label, Modal } from 'semantic-ui-react'
// import cn from 'classnames';
// import { Link } from 'react-router';

import paths from '../paths';
import gameFunctions from '../gameFunctions';

class CharacterItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isFlipped: false
    };
  }
  open = () => {
    this.setState({ isOpen: true });
  }
  close = () => {
    this.setState({ isOpen: false, isFlipped: false });
  }
  flip = () => {
    this.setState({ isFlipped: !this.state.isFlipped });
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
    const { isOpen, isFlipped } = this.state;
    const { character, item } = this.props;
    const { name, type, combat, combatAction, isEquipped, imageFile } = item;

    const block = (
      <div className="characteritem">
        <button className="characteritem__content" onClick={this.open}>
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
        <Modal basic closeOnDimmerClick={false} open={isOpen} className="characteritem__detail">
          <div className={cn('cardflipper', {'is-flipped':isFlipped})} onClick={this.flip}>
            <Card
              image={paths.itemImage(imageFile)}
            />
            <Card
              header={name}
              meta={type}
            />
          </div>
          <div className="characteritem__actions">
            <div>
              <Button inverted circular icon size="massive" color="red" onClick={this.trash}>
                <Icon name="trash" />
              </Button>
              <div className="buttonlabel">trash</div>
            </div>
            <div>
              <Button inverted circular color={isEquipped ? 'green' : 'grey'} icon size="massive" onClick={this.toggleEquip}>
                <Icon name="thumbs up"/>
              </Button>
              <div className="buttonlabel">{isEquipped ? 'equipped' : 'unequipped'}</div>
            </div>
            <div>
              <Button inverted circular icon size="massive" onClick={this.close}>
                <Icon name="long arrow right" />
              </Button>
              <div className="buttonlabel">done</div>
            </div>
          </div>
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
