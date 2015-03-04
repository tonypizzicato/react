"use strict";

var $                  = require('jquery'),
    React              = require('react'),
    Router             = require('react-router'),
    mui                = require('material-ui'),

    Dragon             = require('react-dragon'),

    Tabs               = mui.Tabs,
    Tab                = mui.Tab,
    DropDownMenu       = mui.DropDownMenu,

    EventsConstants    = require('../../constants/EventsConstants'),
    CountriesActions   = require('../../actions/CountriesActions'),
    CountriesStore     = require('../../stores/CountriesStore'),
    TournamentsActions = require('../../actions/TournamentsActions'),
    TournamentStore    = require('../../stores/TournamentsStore'),

    TournamentForm      = require('../tournaments/TournamentForm.jsx'),
    TournamentsList    = require('../tournaments/TournamentsList.jsx');

var _calls = [],
    _deferred;

var TournamentApp = React.createClass({

    mixins: [Router.State],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required
        }
    },

    getInitialState: function () {
        return {
            countries:          [],
            tournaments:        [],
            selectedTournament: {}
        }
    },

    componentDidMount: function () {
        _calls = [];
        _deferred = new $.Deferred();

        _deferred.then(function () {
            if (!this.isMounted()) {
                return;
            }

            this.setState({
                countries:          CountriesStore.getAll(),
                tournaments:        TournamentStore.getAll(),
                selectedTournament: this.getInitialState().selectedTournament
            });
        }.bind(this));

        TournamentStore.addChangeListener(this._onChange);

        CountriesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.addListener(EventsConstants.EVENT_CALL, this._onCall);

        if (this.props.leagues.length) {
            CountriesActions.load();
            TournamentsActions.load();
        }
    },

    componentWillUnmount: function () {
        TournamentStore.removeChangeListener(this._onChange);

        CountriesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
    },

    componentWillReceiveProps: function (nextProps) {
        console.log('RECEIVED NEW PROPS');
        if (nextProps.leagues.length !== this.props.leagues.length) {
            CountriesActions.load();
            TournamentsActions.load();
        }
    },

    _onCall: function (call) {
        _calls.push(call);

        if (_calls.length == 2) {
            $.when(_calls[0], _calls[1]).done(function () {
                _deferred.resolve();
            }.bind(this));
        }
    },

    _onTabChange: function () {
        this.setState({
            selectedTournament: this.getInitialState().selectedTournament
        });
    },

    _onChange: function () {
        this.setState({
            selectedTournament: this.getInitialState().selectedTournament
        });
    },

    _onEdit: function (e) {
        this.setState({
            selectedTournament: this.state.tournaments.filter(function (tournament) {
                return tournament._id == e.currentTarget.dataset.id;
            }).pop()
        });
    },

    _onCancel: function () {
        this.setState({
            selectedTournament: this.getInitialState().selectedTournament
        });
    },

    render: function () {
        console.log("TOURNAMENTS RENDERING");
        var tabItems = this.props.leagues.map(function (league) {

            var tournamentsItems = this.state.tournaments.filter(function (tournament) {
                return tournament.leagueId == league._id;
            }.bind(this));

            var countries = this.state.countries.filter(function (country) {
                return country.leagueId == league._id;
            });

            var key = this.state.selectedTournament._id + '-edit';

            return (
                <Tab label={league.name} key={league._id}>
                    <TournamentForm tournament={this.state.selectedTournament} countries={countries} leagueId={league._id} onCancel={this._onCancel} key={key} />
                    <TournamentsList tournaments={tournamentsItems} onEdit={this._onEdit} />
                </Tab>
            );
        }.bind(this));

        return (
            <Tabs onChange={this._onTabChange}>{tabItems}</Tabs>
        );
    }
});

module.exports = TournamentApp;
