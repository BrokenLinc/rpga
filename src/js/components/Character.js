import { sortBy } from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';

import base from '../base';
import { getFullCharacter } from '../gameFunctions';
import CharacterThumb from './CharacterThumb';
import CharacterInfoTabs from './CharacterInfoTabs';

class Character extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      isLoading: true,
      showSkills: false,
    };
  }
  componentDidMount() {
    const { uid } = this.context.user;
    const { characterKey } = this.props.params;

    this.ref = base.listenTo(`users/${uid}/characters/${characterKey}`, {
      context: this,
      then: (character) => {
        this.setState({
          character: assign(
            { key: characterKey },
            getFullCharacter(character),
            { items: sortBy(map(character.items, (item, key) => assign({ key }, item)), 'combat').reverse() }
          ),
          isLoading: false
        })
      },
    });
  }
  toggleSkills = () => {
    this.setState({ showSkills: !this.state.showSkills });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  render() {
    const { tab } = this.props.params;
    const { character, isLoading, showSkills } = this.state;

    return (
      <div className={cn('character',{'show-skills': showSkills})}>
        <Dimmer active={isLoading}>
          <Loader>Loading character</Loader>
        </Dimmer>
        {character && (
          <button className="character__header" onClick={this.toggleSkills}>
            <CharacterThumb character={character} />
          </button>
        )}
        {character && (
          <div className="character__skills">
            <ul>
              {map(character.skills, (value, skill) => (
                <li key={skill}>{skill}: {value}</li>
              ))}
            </ul>
          </div>
        )}
        {character && (
          <div className="character__tabs">
            <CharacterInfoTabs character={character} initialTab={tab} />
          </div>
        )}
      </div>
    );
  }
}

Character.contextTypes = {
  user: PropTypes.object.isRequired,
};

Character.propTypes = {
  params: PropTypes.object,
};

export default Character;
