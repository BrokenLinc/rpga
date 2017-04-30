// import { map } from 'lodash';
// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react'

import base from '../base';
import gameFunctions from '../gameFunctions';
import { Activities } from '../templates';
import Countdown from './Countdown';

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
            <Button onClick={this.returnFromMission}>Get updates</Button>
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
          { activity && <Segment textAlign="left">{activity.story}</Segment> }
          <p><b>What will {character.name} do next?</b></p>
          { map(Activities, (activity, key) => {
            const { label, icon } = activity;
            return (
              <Button key={key} onClick={() => this.doActivity(activity)}>
                <Icon name={ icon || 'angle right' } />{ label }
              </Button>
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
