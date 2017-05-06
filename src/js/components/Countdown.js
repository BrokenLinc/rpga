import { Progress } from 'semantic-ui-react';

class Countdown extends Component {
  componentDidMount() {
    this.updateInterval = setInterval(this.forceUpdate.bind(this),30)
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
      <div className="countdown">
        { clock.join(':') } remaining
        <Progress percent={(1 - msDiff / 10000) * 100} color='green' />
      </div>
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
