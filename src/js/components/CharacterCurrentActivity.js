import { map } from 'lodash';
import React, { Component, PropTypes } from 'react';

import base from '../base';
import gameFunctions from '../gameFunctions';
import { Activities } from '../constants';
import Countdown from './Countdown';
import Icon from './Icon';

class CharacterCurrentActivity extends Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
    this.returnFromMission = this.returnFromMission.bind(this);
    this.doActivity = this.doActivity.bind(this);
  }
  componentDidMount() {
    this.updateInterval = setInterval(this.forceUpdate,500)
  }
  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }
  doActivity(activity) {
    const { user } = this.context;
    const { character } = this.props;

    gameFunctions.doActivity(user, character, activity);
  }
  returnFromMission() {
    const { user } = this.context;
    const { character } = this.props;

    gameFunctions.returnFromMission(user, character);
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
      result = (
        <div className="charactercurrentactivity">
          { activity && <p>{activity.story}</p> }
          <p><b>What will {character.name} do next?</b></p>
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
  character: PropTypes.object,
};

export default CharacterCurrentActivity;
