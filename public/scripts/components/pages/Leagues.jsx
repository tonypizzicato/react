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
    handleSave(league) {
        const actionName = this.state.addMode ? 'add' : 'save';

        this.props.dispatch(LeaguesActions[actionName](league))
            .then(() => this.props.dispatch(LeaguesActions.fetch()))
            .then(this._onCancel);
    }

    @autobind
    handleCancelEdit() {
        this.setState({
            selectedLeague: {}
        });
    }

    render() {
        const league = this.state.selectedLeague;
        const key    = `${league._id ? league._id : _.uniqueId()}-form`;

        return (
            <div>
                <LeagueForm league={this.state.selectedLeague}
                            onCancel={this.handleCancelEdit}
                            onSubmit={this.handleSave}
                            key={key}
                />

                <LeaguesList leagues={this.props.leagues.items}
                             onEdit={this._onEdit}
                />
            </div>
        );
    }
}

const mapProps = state => {
    return {
        leagues: state.get('leagues').toJS()
    }
};

export default connect(mapProps)(LeaguesApp);
