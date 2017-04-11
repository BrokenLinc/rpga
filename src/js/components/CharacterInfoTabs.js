import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

import CharacterCurrentActivity from './CharacterCurrentActivity';
import CharacterItemList from './CharacterItemList';
import Icon from './Icon';

const TABS = {
  activity: { left: '0' }, // needed for transitions
  items: { left: '-100%' },
};

class CharacterInfoTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: TABS[props.initialTab] || TABS.activity,
    };

    this.selectTab = this.selectTab.bind(this);
  }
  selectTab(activeTab) {
    this.setState({activeTab});
  }
  render() {
    const { character, characterKey } = this.props;
    const { activeTab } = this.state;

    return (
      <div className="characterinfotabs">
        <ul className="characterinfotabs__headers">
          <li className={cn({'is-active':activeTab===TABS.activity})} onClick={() => this.selectTab(TABS.activity)}>
            <Icon name="clock-o" /> activity
          </li>
          <li className={cn({'is-active':activeTab===TABS.items})} onClick={() => this.selectTab(TABS.items)}>
            <Icon name="male" /> items
          </li>
        </ul>
        <div className="characterinfotabs__regionscontainer">
          <ul className="characterinfotabs__regions" style={activeTab}>
            <li className="scrollable"><CharacterCurrentActivity characterKey={characterKey} character={character}/></li>
            <li className="scrollable"><CharacterItemList characterKey={characterKey} character={character}/></li>
          </ul>
        </div>
      </div>
    );
  }
}

CharacterInfoTabs.propTypes = {
  characterKey: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default CharacterInfoTabs;
