import React, { Component, PropTypes } from 'react';

import base from '../base';
import CharacterThumb from './CharacterThumb';
import ContentLoader from './ContentLoader';
import CharacterInfoTabs from './CharacterInfoTabs';

class Character extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      isLoading: true,
    };
  }
  componentDidMount() {
    const { uid } = this.context.user;
    const { characterKey } = this.props.params;

    this.ref = base.bindToState(`users/${uid}/characters/${characterKey}`, {
      context: this,
      state: 'character',
      then: () => {
        this.setState({isLoading: false})
      },
    });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  render() {
    const { uid } = this.context.user;
    const { characterKey, tab } = this.props.params;
    const { character, isLoading } = this.state;

    return (
      <ContentLoader isLoading={isLoading} align="center">
        {character ? (
          <div className="character">
              <div className="character__header">
                <CharacterThumb character={character} />
              </div>
            <CharacterInfoTabs characterKey={characterKey} character={character} initialTab={tab} />
          </div>
        ) : null}
      </ContentLoader>
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
