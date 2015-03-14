"use strict";

var _               = require('underscore'),
    React           = require('react'),
    Router          = require('react-router'),
    mui             = require('material-ui'),

    EventsConstants = require('../../constants/EventsConstants'),
    LeaguesActions  = require('../../actions/LeaguesActions'),
    LeaguesStore    = require('../../stores/LeaguesStore'),

    LeagueForm      = require('../leagues/LeagueForm.jsx'),
    LeaguesList     = require('../leagues/LeaguesList.jsx');

var LeaguesApp = React.createClass({

    mixins: [Router.State],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required
        }
    },

    getInitialState: function () {
        return {
            selectedLeague: {}
        }
    },

    componentDidMount: function () {
        LeaguesStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        LeaguesStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState({
            selectedLeague: this.getInitialState().selectedLeague
        });
    },

    _onEdit: function (e) {
        this.setState({
            selectedLeague: _.findWhere(this.props.leagues, {_id: e.currentTarget.dataset.id})
        });
    },

    _onCancel: function () {
        this.setState({
            selectedLeague: this.getInitialState().selectedLeague
        });
    },

    render: function () {
        return (
            <div>
                <LeagueForm league={this.state.selectedLeague} onCancel={this._onCancel} key={this.state.selectedLeague._id + '-league-form'}/>
                <LeaguesList leagues={this.props.leagues} onEdit={this._onEdit} key="leagues-list" />
            </div>
        );
    }
});

module.exports = LeaguesApp;
