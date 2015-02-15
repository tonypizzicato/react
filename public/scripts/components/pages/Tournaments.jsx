"use strict";

var $                  = require('jquery'),
    React              = require('react'),
    Router             = require('react-router'),
    mui                = require('material-ui'),

    Tabs               = mui.Tabs,
    Tab                = mui.Tab,
    DropDownMenu       = mui.DropDownMenu,

    EventsConstants    = require('../../constants/EventsConstants'),
    LeaguesActions     = require('../../actions/LeaguesActions'),
    LeaguesStore       = require('../../stores/LeaguesStore'),
    TournamentsActions = require('../../actions/TournamentsActions'),
    TournamentStore    = require('../../stores/TournamentsStore');

var _calls = [],
    _deferred;

var TournamentApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            leagues:     [],
            tournaments: []
        }
    },

    componentDidMount: function () {
        _calls = [];
        _deferred = new $.Deferred();

        LeaguesStore.addChangeListener(this._onChange);
        TournamentStore.addChangeListener(this._onChange);

        LeaguesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.addListener(EventsConstants.EVENT_CALL, this._onCall);

        // Load entities
        LeaguesActions.load();
        TournamentsActions.load();
    },

    componentWillUnmount: function () {
        LeaguesStore.removeChangeListener(this._onChange);
        TournamentStore.removeChangeListener(this._onChange);

        LeaguesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
    },

    _onCall: function (call) {
        _calls.push(call);

        if (_calls.length == 2) {
            $.when(_calls[0], _calls[1]).done(function () {
                _deferred.resolve();
            }.bind(this));
        }
    },

    _onChange: function () {
        _deferred.then(function () {
            this.setState({
                leagues:     LeaguesStore.getAll(),
                tournaments: TournamentStore.getAll()
            });
        }.bind(this));
    },

    render: function () {
        var tabItems = this.state.leagues.map(function (league) {
            return <Tab label={league.name} />;
        });
        return (
            <Tabs>{tabItems}</Tabs>
        );
    }
});

module.exports = TournamentApp;