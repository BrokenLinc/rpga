import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

import CharacterItemList from './CharacterItemList';

const TABS = {
  now: { left: '0' }, // needed for transitions
  items: { left: '-100%' },
  log: { left: '-200%' },
};

class CharacterInfoTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: TABS[props.initialTab] || TABS.now,
    };

    this.selectTab = this.selectTab.bind(this);
  }
  selectTab(activeTab) {
    this.setState({activeTab});
  }
  render() {
    const { uid } = this.context.user;
    const { character, characterKey } = this.props;
    const { activeTab } = this.state;

    return (
      <div className="characterinfotabs">
        <ul className="characterinfotabs__headers">
          <li className={cn({'is-active':activeTab===TABS.now})} onClick={() => this.selectTab(TABS.now)}>C</li>
          <li className={cn({'is-active':activeTab===TABS.items})} onClick={() => this.selectTab(TABS.items)}>I</li>
          <li className={cn({'is-active':activeTab===TABS.log})} onClick={() => this.selectTab(TABS.log)}>L</li>
        </ul>
        <div className="characterinfotabs__regionscontainer">
          <ul className="characterinfotabs__regions" style={activeTab}>
            <li>Current Activity</li>
            <li><CharacterItemList uid={uid} characterKey={characterKey} items={character.items}/></li>
            <li>Last Activity</li>
          </ul>
        </div>
      </div>
    );
  }
}

CharacterInfoTabs.contextTypes = {
  user: PropTypes.object.isRequired,
};

CharacterInfoTabs.propTypes = {
  characterKey: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default CharacterInfoTabs;
