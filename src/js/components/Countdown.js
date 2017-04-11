import React, { Component, PropTypes } from 'react';

class Countdown extends Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
  }
  componentDidMount() {
    this.updateInterval = setInterval(this.forceUpdate,1000)
  }
  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }
  render() {
    const { givenDate, showDays, showHours } = this.props;

    const formattedGivenDate = new Date(givenDate);
    const today = new Date();
    const msDiff = Math.max(formattedGivenDate - today, 0);
    const days = showDays ? parseInt(msDiff/(24*3600*1000)) : 0;
    const hours = showHours ? parseInt(msDiff/(3600*1000)-(days*24)) : 0;
    const mins = parseInt(msDiff/(60*1000)-(days*24*60)-(hours*60));
    const secs = parseInt(msDiff/(1000)-(mins*60)-(days*24*60*60)-(hours*60*60));

    const clock = [];
    // left pad results
    if (showDays) clock.push(days);
    if (showHours) clock.push(String('00' + hours).slice(-2));
    clock.push(String('00' + mins).slice(-2));
    clock.push(String('00' + secs).slice(-2));

    return(
      <div className="countdown">{ clock.join(':') }</div>
    )
  }
}

Countdown.propTypes = {
  showDays: PropTypes.bool,
  showHours: PropTypes.bool,
  givenDate: PropTypes.number.isRequired,
};

Countdown.defaultProps = {
  showDays: true,
  showHours: true,
};

export default Countdown;
