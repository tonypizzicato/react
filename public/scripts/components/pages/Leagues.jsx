import _ from 'lodash';
import { autobind } from 'core-decorators';

import scrollTop from '../../utils/scrollTop';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import LeagueForm from '../leagues/LeagueForm.jsx';
import LeaguesList from '../leagues/LeaguesList.jsx';

import LeaguesActions from '../../actions/LeaguesActions';

class LeaguesApp extends Component {

    static propTypes = {
        leagues: PropTypes.object.isRequired
    };

    state = {
        selectedLeague: {}
    };

    @autobind
    handleStartEdit(e) {
        this.setState({
            selectedLeague: _.findWhere(this.props.leagues.items, { _id: e.currentTarget.dataset.id })
        });

        scrollTop();
    }

    @autobind
    handleSave(data) {
        this.props.dispatch(LeaguesActions.save(data));
    }

    @autobind
    handleCancelEdit() {
        this.setState({
            selectedLeague: {}
        });
    }

    render() {
        return (
            <div>
                <LeagueForm league={this.state.selectedLeague}
                            onCancel={this.handleCancelEdit}
                            onSubmit={this.handleSave}
                            key={`${this.state.selectedLeague._id}-form`}/>

                <LeaguesList leagues={this.props.leagues.items}
                             onEdit={this.handleStartEdit}
                             key={`${this.state.selectedLeague._id}-list`}/>
            </div>
        );
    }
}

export default connect(state => state.toJS())(LeaguesApp);
