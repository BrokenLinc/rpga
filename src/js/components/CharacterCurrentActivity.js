import { assign } from 'lodash';
import React, { Component, PropTypes } from 'react';

import base from '../base';
import { ItemTypes } from '../constants';
import { rint } from '../utils';
import Countdown from './Countdown';
import Icon from './Icon';

class CharacterCurrentActivity extends Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
    this.sendOnMission = this.sendOnMission.bind(this);
    this.returnFromMission = this.returnFromMission.bind(this);
    this.rest = this.rest.bind(this);
  }
  componentDidMount() {
    this.updateInterval = setInterval(this.forceUpdate,500)
  }
  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }
  rest() {
    const { uid } = this.context.user;
    const { characterKey, character } = this.props;
    const returnDate = new Date(new Date().getTime() + 10000); // 10sec

    base.update(`users/${uid}/characters/${characterKey}/activity`, {
      data: {
        returnDate,
        returnMessage: `${character.name} staggers out of bed mumbling something about a dream.`,
        awayMessage: `${character.name} is in bed, with visions of sugar plums pillaging a dank dungeon.`,
        life: 5,
        story: `${character.name} had a dream where Michael Keaton was running for president on a "pro-jello" campaign platform. Nevertheless, a complete night's rest was had.`,
      }
    });
  }
  sendOnMission() {
    const { uid } = this.context.user;
    const { characterKey, character } = this.props;
    const returnDate = new Date(new Date().getTime() + 10000); // 10sec
    const item = {
      combat: 5,
      type: ItemTypes.LEGS,
      combatAction: 'defense',
      name: 'Stonewashed Jeans',
    };
    
    base.update(`users/${uid}/characters/${characterKey}/activity`, {
      data: {
        returnDate,
        returnMessage: `You can tell ${character.name} is back because the air smells like demon eggs.`,
        awayMessage: `${character.name} is out sifting through piles of junk and will return soon.`,
        life: rint(0,5),
        story: `${character.name} went out scavenging, and found ${item.name}.`,
        item,
      }
    });
  }
  returnFromMission() {
    const { uid } = this.context.user;
    const { characterKey, character } = this.props;
    const { activity } = character;
    const { life, item } = activity;
    base.push(`users/${uid}/characters/${characterKey}/items`, {
      data: item,
      then: () => {
        base.update(`users/${uid}/characters/${characterKey}`, {
          data: {
            life,
          },
          then: () => {
            base.remove(`users/${uid}/characters/${characterKey}/activity/returnDate`);
          }
        });
      }
    });
  }
  render() {
    const { character } = this.props;
    const { activity } = character;

    let result;
    if (activity && activity.returnDate) {
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
      result = (
        <div className="charactercurrentactivity">
          <p>{ intro }</p>
          <button className="btn btn-block" onClick={this.sendOnMission}>
            Go scavenging <Icon name="angle-right" />
          </button>
          <button className="btn btn-block" onClick={this.rest}>
            Stay in bed <Icon name="bed" />
          </button>
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
