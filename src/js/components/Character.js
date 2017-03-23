import { assign, each, filter, map, sumBy } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import cn from 'classnames';

import base from '../base';
import { characterSpec } from '../specs';
import Inventory from './Inventory';
import PaperDoll from './PaperDoll';
import Portrait from './Portrait';
import TransitionGroup from './TransitionGroup';

const ACTION_ICON = {
  defense: 'shield',
  attack: 'broadsword',
  poison: 'gooey-sword',
};

const rint = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const getCombatCharacter = (character) => {
  return {
    isCharacter: true,
    name: character.name,
    life: character.life,
    combat: getCombatTotal(character),
    attack: getActionTotal('attack', character),
    defense: getActionTotal('defense', character),
    attacks: getActionItems('attack', character),
    defenses: getActionItems('defense', character),
  };
};

const pickFromActions = (items, value) => {
  let threshold = 0;
  for(let i in items) {
    threshold += items[i].combat;
    if(threshold >= value) {
      return items[i];
    }
  }
  return actions[0]; // just in case
};

const fillItemScript = (item, attacker, defender) => {
  let script = item.script;
  script = script.replace(/{attacker}/g, attacker.name);
  script = script.replace(/{defender}/g, defender.name);
  script = script.replace(/{item}/g, item.name);
  return script;
};

const swing = (attacker, defender, log, actionlog) => {
  let hit = rint(1, attacker.attack + defender.defense);
  let item;

  if(hit > defender.defense) {
    defender.life--;
    item = pickFromActions(attacker.attacks, hit - defender.defense);
    log.push(fillItemScript(item, attacker, defender));
    actionlog.push({
      actor: attacker,
      item: item,
    });
    //log.push(`${attacker.name} (${attacker.life}) hits ${defender.name} (${defender.life}) with ${pickFromActions(attacker.attacks, hit - defender.defense).name}!`);
  } else {
    item = pickFromActions(defender.defenses, hit);
    log.push(fillItemScript(item, attacker, defender));
    actionlog.push({
      actor: defender,
      item: item,
    });
    //log.push(`${attacker.name} (${attacker.life}) misses ${defender.name} (${defender.life}) with ${pickFromActions(defender.defenses, hit).name}!`);
  }
};

const fightRandomMonster = (_character) => {
  let turn = 0;
  const log = [];
  const actionlog = [];
  const character = getCombatCharacter(_character);
  const monster = generateMonster(rint(1, character.combat * 2));
  const turnorder = [character, monster]; //determined by init

  log.push(`${character.name} (${character.combat}) starts a fight with ${monster.name} (${monster.combat})!`);

  while(character.life > 0 && monster.life > 0) {
    if (turn % 2 === 0) {
      swing(character, monster, log, actionlog);
    } else {
      swing(monster, character, log, actionlog);
    }
    turn++;
  }

  return {
    actionlog,
    log,
    character,
    monster,
  }
}

const generateMonster = (combat) => {
  const name = 'A Snake';
  const attack = rint(1, combat);
  const defense = combat - attack;
  return {
    isMonster: true,
    name,
    life: 5,
    combat,
    attack,
    defense,
    attacks: [{
      name: 'Venemous Bite',
      combat: attack,
      combatAction: 'poison',
      script: '{attacker} bites at {defender} with venemous fangs!',
    }],
    defenses: [{
      name: 'Leap',
      combat: defense,
      combatAction: 'defense',
      script: '{defender} leaps out of the way of {attacker}\'s attack.',
    }],
  };
}

const getEquippedItems = (items) => {
  return filter(items, 'slot');
};

const getActionItems = (type, character) => {
  return filter(getEquippedItems(character.items), { combatAction: type });
};

const getCombatTotal = (character) => {
  return sumBy(getEquippedItems(character.items), 'combat');
};

const getActionTotal = (type, character) => {
  return sumBy(getActionItems(type, character), 'combat');
};

class Character extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      isLoading: true,
    };

    // this.battle = this.battle.bind(this);
    // this.battleCombat = this.battleCombat.bind(this);
    this.goAdventuring = this.goAdventuring.bind(this);
  }
  componentDidMount() {
    const { uid } = this.context.user;
    const { characterKey } = this.props.params;

    this.ref = base.bindToState(`users/${uid}/characters/${characterKey}`, {
      context: this,
      state: 'character',
      then: () => {
        this.setState({isLoading: false})
      },
    });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  goAdventuring() {
    const fightResult = fightRandomMonster(this.state.character);
    console.log(fightResult.log.join(' '));
    console.log(fightResult.character);
    console.log(fightResult.monster);
    this.setState({ fightResult });
  }
  // getCombat(character) {
  //   let total = 0;
  //   each(character.items, ({ combat, slot }) => {
  //     if(slot) {
  //       total += combat;
  //     }
  //   });
  //   // each(character.effects, ({ combat }) => {
  //   //   total += combat;
  //   // });
  //   return total;
  // }
  // getCombatTotal(character) {
  //   let total = 0;
  //   each(character.items, ({ combat, slot }) => {
  //     if(slot) {
  //       total += Math.abs(combat);
  //     }
  //   });
  //   each(character.effects, ({ combat }) => {
  //     total += Math.abs(combat);
  //   });
  //   return total;
  // }
  // getCombatMinMax(character) {
  //   const o = {
  //     min: 0,
  //     max: 0,
  //   };
  //   each(character.items, ({ combat, combatAction, slot }) => {
  //     if(slot) {
  //       o.max += combat;
  //       if(combatAction === 'armor') {
  //         o.min += combat;
  //       }
  //     }
  //   });
  //   each(character.effects, ({ combat, combatAction }) => {
  //     o.max += combat;
  //     o.min += combat;
  //   });
  //   o.min = Math.max(0,o.min);
  //   o.max = Math.max(0,o.max);
  //   return o;
  // }
  // battleMinMax(character1, character2) {
  //   const combat1 = this.getCombatMinMax(character1);
  //   const combat2 = this.getCombatMinMax(character2);
  //   const attack1 = rint(combat1.min, combat1.max);
  //   const attack2 = rint(combat2.min, combat2.max);
  //   console.log(attack1, attack2);
  // }
  // battle(character1, character2) {
  //   const combat1 = this.getCombat(character1);
  //   const combat2 = this.getCombat(character2);
  //   const attack1 = rint(0, combat1);
  //   const attack2 = rint(0, combat2);
  //   console.log(attack1, attack2);
  // }
  // battleCombat(combat1, combat2) {
  //   const attack1 = rint(0, combat1);
  //   const attack2 = rint(0, combat2);
  //   console.log(attack1, attack2);
  // }
  // getCombatItems(character) {
  //   const array = [];
  //   each(character.items, (item) => {
  //     if(item.slot) {
  //       array.push(item);
  //     }
  //   });
  //   return array;
  // }
  // getCombatArray(character) {
  //   const o = {};
  //   each(character.items, ({ combat, combatAction, slot }) => {
  //     if(slot) {
  //       o[combatAction] = (o[combatAction] || 0) + combat;
  //     }
  //   });
  //   // each(character.effects, ({ combat, combatAction }) => {
  //   //   o[combatAction] = (o[combatAction] || 0) + combat;
  //   // });
  //   return o;
  // }
  render() {
    const { uid } = this.context.user;
    const { characterKey } = this.props.params;
    const { character, fightResult, isLoading, wins, draws, losses } = this.state;

    if(isLoading) return null;

    const { imageFile, name, power, life } = characterSpec(character);
    //const combat = this.getCombat(character);
    //const combatArray = this.getCombatArray(character);
    const attack = getActionTotal('attack', character);
    const defense = getActionTotal('defense', character);
    const combat = getCombatTotal(character);

    return (
      <div>
        <h1>{ name }</h1>
        <Portrait imageFile={imageFile} className="is-large" />

        {/*
        <a href="javascript:void(0)" onClick={ () => { this.battleCombat(combat,1) } }>Fight 1</a><br/>
        <a href="javascript:void(0)" onClick={ () => { this.battleCombat(combat,2) } }>Fight 2</a><br/>
        <a href="javascript:void(0)" onClick={ () => { this.battleCombat(combat,3) } }>Fight 3</a><br/>
        <a href="javascript:void(0)" onClick={ () => { this.battleCombat(combat,4) } }>Fight 4</a><br/>
        <a href="javascript:void(0)" onClick={ () => { this.battleCombat(combat,5) } }>Fight 5</a><br/>
        <a href="javascript:void(0)" onClick={ () => { this.battleCombat(combat,6) } }>Fight 6</a><br/>
        */}
        <button className="btn btn-default" onClick={ this.goAdventuring }>Go Adventuring</button>

        {fightResult ? (
          <ul className="combatlog">
            {map(fightResult.actionlog, (event, index) => {
              const { actor, item} = event;
              const className = cn(
                'combatlog__event',
                `is-${item.combatAction}`,
                {
                  'is-character': actor.isCharacter,
                  'is-monster': actor.isMonster,
                }
              );
              return (
                <div key={index} className={className}>
                  <GameIcon icon={ACTION_ICON[item.combatAction]}/>
                  {item.name}
                </div>
              );
          })}
          </ul>
        ) : null}

        <div className="combattotal">
          <div className="combattotal__value">
            { life }
          </div>
          <div className="combattotal__label">Life</div>
          <div className="combattotal__value">
            { attack }
          </div>
          <div className="combattotal__label">Attack</div>
          <div className="combattotal__value">
            { defense }
          </div>
          <div className="combattotal__label">Defense</div>
          <div className="combattotal__value">
            { combat }
          </div>
          <div className="combattotal__label">Combat</div>
        </div>
        {/*<TransitionGroup
          transition="flex-grow"
          component="ul"
          className="combatdistribution"
        >
          {map(combatArray, (combat, combatAction) => (
            <li key={combatAction} className={`is-${combatAction}`} style={{flexGrow: Math.abs(combat)}}>
              <span>{ combat } { combatAction }</span>
            </li>
          ))}
        </TransitionGroup>*/}
        {/*<ul className="combatdistribution">
          {map(combatItems, ({ combat, combatAction }, index) => (
            <li key={index} className={`is-${combatAction}`} style={{flexGrow: combat}}></li>
          ))}
        </ul>*/}
        <div className="itempanes">
          <PaperDoll uid={uid} characterKey={characterKey}/>
          <Inventory uid={uid} characterKey={characterKey}/>
        </div>
      </div>
    );
  }
}

Character.contextTypes = {
  user: PropTypes.object.isRequired,
};

export default Character;
