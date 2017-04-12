import { assign, clamp, map, sample } from 'lodash';
import React, { Component, PropTypes } from 'react';

import base from '../base';
import { Activities, ItemTypes, ItemScales } from '../constants';
import { generateItem, getFullCharacter, rint } from '../utils';
import Countdown from './Countdown';
import Icon from './Icon';

class CharacterCurrentActivity extends Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
    // this.sendOnMission = this.sendOnMission.bind(this);
    this.returnFromMission = this.returnFromMission.bind(this);
    // this.rest = this.rest.bind(this);
    this.doActivity = this.doActivity.bind(this);
  }
  componentDidMount() {
    this.updateInterval = setInterval(this.forceUpdate,500)
  }
  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }
  // rest() {
  //   const { uid } = this.context.user;
  //   const { characterKey, character } = this.props;
  //   const returnDate = new Date().getTime() + 10000; // 10sec
  //
  //   base.update(`users/${uid}/characters/${characterKey}/activity`, {
  //     data: {
  //       returnDate,
  //       returnMessage: `${character.name} staggers out of bed mumbling something about a dream.`,
  //       awayMessage: `${character.name} is in bed, with visions of sugar plums pillaging a dank dungeon.`,
  //       life: 5,
  //       story: `${character.name} had a dream where Michael Keaton was running for president on a "pro-jello" campaign platform. Nevertheless, a complete night's rest was had.`,
  //       claimed: false,
  //     }
  //   });
  // }
  // sendOnMission() {
  //   const { uid } = this.context.user;
  //   const { characterKey, character } = this.props;
  //   const returnDate = new Date().getTime() + 10000; // 10sec
  //   const itemType = sample(ItemTypes);
  //   const item = {
  //     combat: rint(1,6),
  //     type: itemType,
  //     combatAction: 'defense',
  //     name: `${itemType} OF WARDING`,
  //   };
  //
  //   base.update(`users/${uid}/characters/${characterKey}/activity`, {
  //     data: {
  //       returnDate,
  //       returnMessage: `You can tell ${character.name} is back because the air smells like demon eggs.`,
  //       awayMessage: `${character.name} is out sifting through piles of junk and will return soon.`,
  //       life: rint(0,5),
  //       story: `${character.name} went out scavenging, and found ${item.name}.`,
  //       item,
  //       claimed: false,
  //     }
  //   });
  // }
  doActivity(activity) {
    const { uid } = this.context.user;
    const { characterKey, character } = this.props;
    const returnDate = new Date().getTime() + 10000; // 10sec

    // generate result and item
    const result = sample(activity.results);
    const data = {
      returnDate,
      returnMessage: activity.returnMessage({ character }),
      awayMessage: activity.awayMessage({ character }),
      claimed: false,
    };
    if(result.life) {
      data.life = clamp(character.life + result.life, 0, 5);
    }
    if(result.items) {
      // generate item from activity result
      data.item = sample(result.items);
      data.item.combat = Math.round(rint(activity.minCombat, activity.maxCombat)/16 * ItemScales[data.item.type]);
    }
    data.story = result.story({ character, item: data.item });

    base.update(`users/${uid}/characters/${characterKey}/activity`, { data });
  }
  returnFromMission() {
    // pull result into character and set claimed status
    const { uid } = this.context.user;
    const { characterKey, character } = this.props;
    const { activity } = character;
    const { life, item } = activity;
    if(item) {
      base.push(`users/${uid}/characters/${characterKey}/items`, {
        data: item,
      });
    }
    if(life) {
      base.update(`users/${uid}/characters/${characterKey}`, {
        data: { life },
      });
    }
    base.update(`users/${uid}/characters/${characterKey}/activity`, {
      data: {
        claimed: true,
      }
    });
  }
  render() {
    const { character } = this.props;
    const { activity } = character;

    let result = null;
    if (activity && !activity.claimed) {
      if (new Date(activity.returnDate) <= new Date()) {
        // back
        result = (
          <div className="charactercurrentactivity">
            <p>{ activity.returnMessage }</p>
            <button onClick={this.returnFromMission} className="btn">Get updates</button>
          </div>
        );
      } else {
        // away
        result = (
          <div className="charactercurrentactivity">
            <p>{ activity.awayMessage }</p>
            <h2><Countdown givenDate={activity.returnDate} showDays={false} showHours={false} afterUnmount={this.checkRelease}/></h2>
          </div>
        );
      }
    } else {
      // idle
      let intro;
      if (activity) {
        intro = activity.story;
      } else {
        intro = 'Choose an activity:'
      }
      // result = (
      //   <div className="charactercurrentactivity">
      //     <p>{ intro }</p>
      //     <button className="btn btn-block" onClick={this.sendOnMission}>
      //       Go scavenging <Icon name="angle-right" />
      //     </button>
      //     <button className="btn btn-block" onClick={this.rest}>
      //       Stay in bed <Icon name="bed" />
      //     </button>
      //   </div>
      // );
      result = (
        <div className="charactercurrentactivity">
          <p>{ intro }</p>
          { map(Activities, (activity, key) => {
            const { label, icon } = activity;
            return (
              <button key={key} className="btn btn-block" onClick={() => this.doActivity(activity)}>
                { label } <Icon name={ icon || 'angle-right' } />
              </button>
            );
          }) }
        </div>
      );

    }

    return result;
  }
}

CharacterCurrentActivity.contextTypes = {
  user: PropTypes.object.isRequired,
};

CharacterCurrentActivity.propTypes = {
  characterKey: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  character: PropTypes.object,
};

export default CharacterCurrentActivity;
