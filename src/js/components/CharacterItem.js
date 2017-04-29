import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Icon, Item, Label } from 'semantic-ui-react'
import cn from 'classnames';

import { itemImage } from '../paths';
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
    const { item } = this.props;
    const { name, type, combat, combatAction, isEquipped, imageFile } = item;

    return (
      <Item onClick={this.toggle} style={{padding:15,margin:0,borderBottom:'1px solid rgba(0,0,0,0.1)',position:'relative'}}>
        <Dimmer active={isActive}>
          <Icon onClick={this.trash} name="trash" circular color="red" size="large" inverted style={{margin:'0 10px'}} />
          <Icon onClick={this.toggleEquip} name="check" circular color="green" size="large" inverted style={{margin:'0 10px'}} />
          <Icon onClick={this.toggle} name="cancel" circular color="white" size="large" style={{margin:'0 10px'}} />
        </Dimmer>
        <Item.Image size="tiny" shape="circular" src={itemImage(imageFile)} />
        <Item.Content>
          <Item.Header>{ name }</Item.Header>
          <Item.Meta>
            <Label color={combatAction === 'attack' ? 'pink' : 'blue'} basic>
              { `${combat} ${combatAction}` }
              <Label.Detail>{ type }</Label.Detail>
            </Label>
          </Item.Meta>
          <Item.Description>flavor text</Item.Description>
        </Item.Content>
      </Item>
    );
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
