import { assign } from 'lodash';
import React, { Component, PropTypes } from 'react';

import base from '../base';
import { rint } from '../utils';
import Countdown from './Countdown';

class CharacterCurrentActivity extends Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
    this.sendOnMission = this.sendOnMission.bind(this);
    this.returnFromMission = this.returnFromMission.bind(this);
  }
  componentDidMount() {
    this.updateInterval = setInterval(this.forceUpdate,500)
  }
  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }
  sendOnMission() {
    const { uid } = this.context.user;
    const { characterKey, character } = this.props;
    const returnDate = new Date(new Date().getTime() + 10000); // 10sec
    base.update(`users/${uid}/characters/${characterKey}/activity`, {
      data: {
        returnDate,
        returnMessage: `You can tell ${character.name} is back because the air smells like demon eggs`,
        awayMessage: `${character.name} is out sifting through piles of junk and will return soon.`,
        life: rint(0,5),
        story: `${character.name} went out scavenging, but didn't find anything useful.`,
      }
    });
  }
  returnFromMission() {
    const { uid } = this.context.user;
    const { characterKey, character } = this.props;
    const { activity } = character;
    const { life } = activity;
    base.update(`users/${uid}/characters/${characterKey}`, {
      data: {
        life,
      },
      then: () => {
        base.remove(`users/${uid}/characters/${characterKey}/activity/returnDate`);
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
          <div>
            <p>{ activity.returnMessage }</p>
            <button onClick={this.returnFromMission} className="btn">What happened?</button>
          </div>
        );
      } else {
        // away
        result = (
          <div>
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
        <div>
          <p>{ intro }</p>
          <button onClick={this.sendOnMission} className="btn">Go scavenging</button>
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
