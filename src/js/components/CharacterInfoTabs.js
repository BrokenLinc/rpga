import React, { Component, PropTypes } from 'react';
import { Icon } from 'semantic-ui-react'
import cn from 'classnames';

import CharacterCurrentActivity from './CharacterCurrentActivity';
import CharacterItemList from './CharacterItemList';
import ScrollView from './ScrollView';

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
    const { character } = this.props;
    const { activeTab } = this.state;

    return (
      <div className="characterinfotabs">
        <ul className="characterinfotabs__headers">
          <li className={cn({'is-active':activeTab===TABS.activity})} onClick={() => this.selectTab(TABS.activity)}>
            <Icon name="clock" />activity
          </li>
          <li className={cn({'is-active':activeTab===TABS.items})} onClick={() => this.selectTab(TABS.items)}>
            <Icon name="male" />items
          </li>
        </ul>
        <div className="characterinfotabs__regionscontainer">
          <div className="characterinfotabs__regions" style={activeTab}>
            <ScrollView><CharacterCurrentActivity character={character}/></ScrollView>
            <ScrollView><CharacterItemList character={character}/></ScrollView>
          </div>
        </div>
      </div>
    );
  }
}

CharacterInfoTabs.propTypes = {
  character: PropTypes.object.isRequired,
};

export default CharacterInfoTabs;
