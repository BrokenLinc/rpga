import { each, times } from 'lodash';
import { Label, Progress, Rating } from 'semantic-ui-react'

import { getLevelXP } from '../gameFunctions';
import Portrait from './Portrait';

const percentOfLevel = (character) => {
  return Math.round(100 * character.xp / getLevelXP(character.level));
};

class CharacterThumb extends Component {
  render() {
    const { character } = this.props;
    const { imageFile, name, life, combat, level, xp } = character;

    return (
      <div className="characterthumb">
        <div className="characterthumb__portrait">
          <Portrait imageFile={imageFile} />
        </div>
        <div className="characterthumb__info">
          <h4 className="characterthumb__name">{ name }</h4>
          <div className="characterthumb__stats">
            Level { level } Survivor
          </div>
          <Progress style={{margin:'4px 0'}} percent={percentOfLevel(character)} size="tiny" color="teal" />
          <div style={{display:'flex',alignItems:'center'}}>
            <Label color="green" className="characterthumb__stats">
              { combat } combat
            </Label>
            <div style={{marginLeft:5}} className="characterthumb__health">
              <Rating disabled icon="heart" rating={life} maxRating={5} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CharacterThumb.propTypes = {
  character: PropTypes.object.isRequired,
};

export default CharacterThumb;
