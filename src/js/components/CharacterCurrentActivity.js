import React, { Component, PropTypes } from 'react';

import base from '../base';
import Countdown from './Countdown';

class CharacterCurrentActivity extends Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
    this.sendOnMission = this.sendOnMission.bind(this);
  }
  componentDidMount() {
    this.updateInterval = setInterval(this.forceUpdate,500)
  }
  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }
  sendOnMission() {
    const { uid, characterKey } = this.props;
    const returnDate = new Date(new Date().getTime() + 10000);
    base.update(`users/${uid}/characters/${characterKey}`, {
      data: { returnDate }
    });
  }
  render() {
    const { returnDate } = this.props;

    const isReleased = !returnDate || new Date(returnDate) <= new Date();

    return (
      <div>
      {
        isReleased ? (
          <button onClick={this.sendOnMission} className="btn">Send on Mission</button>
        ) : (
          <div>
            <h5>returning in...</h5>
            <h2><Countdown givenDate={returnDate} showDays={false} showHours={false} afterUnmount={this.checkRelease}/></h2>
          </div>
        )
      }
      </div>
    );
  }
}

CharacterCurrentActivity.propTypes = {
  uid: PropTypes.string.isRequired,
  characterKey: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  returnDate: PropTypes.string,
};

export default CharacterCurrentActivity;
