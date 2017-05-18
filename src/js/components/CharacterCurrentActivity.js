import { Segment } from 'semantic-ui-react'

import base from '../base';
import gameFunctions from '../gameFunctions';
import { Activities } from '../templates';
import Countdown from './Countdown';
import CharacterItem from './CharacterItem';

class CharacterCurrentActivity extends Component {
  componentDidMount() {
    this.updateInterval = setInterval(this.onUpdateInterval,500)
  }
  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }
  onUpdateInterval = () => {
    const activity = get(this.props, 'character.activity');
    if (activity && !activity.claimed && new Date(activity.returnDate) > new Date() - 1000) {
      this.forceUpdate();
    }
  }
  doActivity = (activity) => {
    const { user } = this.context;
    const { character } = this.props;

    gameFunctions.doActivity(user, character, activity);
  }
  returnFromMission = () => {
    const { user } = this.context;
    const { character } = this.props;

    gameFunctions.returnFromMission(user, character);
  }
  render() {
    const { character } = this.props;
    const { activity } = character;

    let afterStory = '';
    if(activity.skillgain) afterStory += `${character.name} gained a point in ${activity.skillgain}! `;
    //if(activity.item) afterStory += `${character.name} got ${activity.item.article} ${activity.item.name}!`;

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
          { activity && <Segment textAlign="left">
            <p dangerouslySetInnerHTML={{__html:activity.story}} />
            {afterStory && (<p style={{color:'#090'}}><i>{afterStory}</i></p>)}
          </Segment> }

          {/* { activity.item && <CharacterItem character={character} item={activity.item} /> } */}

          <h5>What will {character.name} do next?</h5>
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
