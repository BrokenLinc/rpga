import { assign } from 'lodash';
import React, { Component, PropTypes } from 'react';

import base from '../base';
import { characterImage } from '../paths';
import { characterSpec } from '../specs';

const rint = (min, max) => {
  return min + Math.floor( Math.random() * (max - min + 1) );
};

const dice = [1, 6, 10];

const rollAttack = (power) => {
  let result = 0;
  let decayingPower = power;

  while(decayingPower > 0) {
    if(decayingPower >= 10) {
      result += rint(1, 10);
      decayingPower -= 10;
    } else if(decayingPower >= 6) {
      result += rint(1, 6);
      decayingPower -= 6;
    } else {
      result += rint(0, 1);
      decayingPower--;
    }
  }

  return result;
};

class Character extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      isLoading: true,
      wins: 0,
      draws: 0,
      losses: 0,
    };

    this.fight = this.fight.bind(this);
  }
  componentDidMount(){
    const { uid } = this.context.user;
    const { characterKey } = this.props.params;

    this.ref = base.syncState(`users/${uid}/characters/${characterKey}`, {
      context: this,
      state: 'character',
      then: () => {
        this.setState({isLoading: false})
      },
    });
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  fight(monsterPower) {
    const { power } = characterSpec(this.state.character);

    const monsterAttack = rollAttack(monsterPower);
    const playerAttack = rollAttack(power);

    if (monsterAttack > playerAttack) {
      this.setState({ losses: this.state.losses + 1});
    } else if (monsterAttack < playerAttack) {
      this.setState({ wins: this.state.wins + 1});
    } else {
      this.setState({ draws: this.state.draws + 1});
    }

    console.log(`monster ${monsterAttack}, player ${playerAttack}`);
  }
  reset() {
    this.setState({
      wins: 0,
      draws: 0,
      losses: 0,
    });
  }
  render() {
    const { character, isLoading, wins, draws, losses } = this.state;
    const { imageFile, name, power } = characterSpec(character);

    if(isLoading) return null;

    return (
      <div>
        <h1>{ name }</h1>
        <div className="portrait is-large">
          <img src={characterImage(imageFile)}/>
        </div>
        <p>{ power } power</p>
        <p>{ wins } wins</p>
        <p>{ draws } draws</p>
        <p>{ losses } losses</p>
        <button className="btn btn-success" onClick={ () => { this.fight(1) } }>Fight a level 1 cockroach</button><br/>
        <button className="btn btn-success" onClick={ () => { this.fight(2) } }>Fight a level 2 rat</button><br/>
        <button className="btn btn-success" onClick={ () => { this.fight(3) } }>Fight a level 3 cat</button><br/>
        <button className="btn btn-success" onClick={ () => { this.fight(4) } }>Fight a level 4 wolf</button><br/>
        <button className="btn btn-success" onClick={ () => { this.fight(5) } }>Fight a level 5 manbear</button><br/>
        <button className="btn btn-success" onClick={ () => { this.fight(6) } }>Fight a level 6 cerebrus</button><br/>
        <button className="btn btn-success" onClick={ () => { this.fight(20) } }>Fight a level 20 vampire</button><br/>
        <button className="btn btn-danger" onClick={ () => { this.reset() } }>Reset Counts</button>
      </div>
    );
  }
}

Character.contextTypes = {
  user: PropTypes.object.isRequired,
};

export default Character
