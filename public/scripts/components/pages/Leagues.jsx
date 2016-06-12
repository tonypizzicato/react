import _ from 'lodash';
import { autobind } from 'core-decorators';
import React, { Component, PropTypes } from 'react';

import scroll from '../../utils/scrollTo';

import LeaguesActions from '../../actions/LeaguesActions';
import LeaguesStore from '../../stores/LeaguesStore';

import LeagueForm from '../leagues/LeagueForm.jsx';
import LeaguesList from '../leagues/LeaguesList.jsx';

class LeaguesApp extends Component {

  static propTypes = {
    leagues: PropTypes.array.isRequired
  };

  state = {
    selectedLeague: {}
  };

  componentDidMount() {
    LeaguesStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    LeaguesStore.removeChangeListener(this.onChange);
    LeaguesActions.load();
  }

  @autobind
  onChange() {
    this.setState({
      selectedLeague: {}
    });
  }

  @autobind
  onEdit(id) {
    this.setState({
      selectedLeague: _.findWhere(this.props.leagues, { _id: id })
    });

    _.defer(() => {
      scroll.scrollTo(0, 800, scroll.easing.easeOutQuad);
    });
  }

  @autobind
  onSort() {
    // LeaguesActions.load();
  }

  @autobind
  onCancel() {
    this.setState({
      selectedLeague: {}
    });
  }

  render() {
    return (
      <div>
        <LeagueForm league={this.state.selectedLeague} onCancel={this.onCancel} key={this.state.selectedLeague._id + '-league-form'}/>
        <LeaguesList leagues={this.props.leagues} onEdit={this.onEdit} onSort={this.onSort} key="leagues-list"/>
      </div>
    );
  }
}

module.exports = LeaguesApp;
