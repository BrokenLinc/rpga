import { each, times } from 'lodash';
import { Rating } from 'semantic-ui-react'

import Portrait from './Portrait';

class CharacterThumb extends Component {
  render() {
    const { character } = this.props;
    const { imageFile, name, life, combat, level } = character;

    return (
      <div className="characterthumb">
        <div className="characterthumb__portrait">
          <Portrait imageFile={imageFile} />
        </div>
        <div className="characterthumb__info">
          <h4 className="characterthumb__name">{ name }</h4>
          <div className="characterthumb__health">
            <Rating disabled icon="heart" rating={life} maxRating={5} />
          </div>
          <div className="characterthumb__stats">
            Lvl { level } / { combat } combat
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
