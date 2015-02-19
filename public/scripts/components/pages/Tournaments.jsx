"use strict";

var $                    = require('jquery'),
    React                = require('react'),
    Router               = require('react-router'),
    mui                  = require('material-ui'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    Tabs                 = mui.Tabs,
    Tab                  = mui.Tab,
    DropDownMenu         = mui.DropDownMenu,

    EventsConstants      = require('../../constants/EventsConstants'),
    LeaguesActions       = require('../../actions/LeaguesActions'),
    LeaguesStore         = require('../../stores/LeaguesStore'),
    CountriesActions     = require('../../actions/CountriesActions'),
    CountriesStore       = require('../../stores/CountriesStore'),
    TournamentsActions   = require('../../actions/TournamentsActions'),
    TournamentStore      = require('../../stores/TournamentsStore'),

    TournamentNew        = require('../tournaments/TournamentNew.jsx'),
    TournamentItem       = require('../tournaments/TournamentItem.jsx');

var _calls = [],
    _deferred;

var TournamentApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            leagues:            [],
            countries:          [],
            tournaments:        [],
            selectedTournament: {}
        }
    },

    componentDidMount: function () {
        _calls = [];
        _deferred = new $.Deferred();

        LeaguesStore.addChangeListener(this._onChange);
        CountriesStore.addChangeListener(this._onChange);
        TournamentStore.addChangeListener(this._onChange);

        LeaguesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);
        CountriesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.addListener(EventsConstants.EVENT_CALL, this._onCall);

        // Load entities
        LeaguesActions.load();
        CountriesActions.load();
        TournamentsActions.load();
    },

    componentWillUnmount: function () {
        LeaguesStore.removeChangeListener(this._onChange);
        CountriesStore.removeChangeListener(this._onChange);
        TournamentStore.removeChangeListener(this._onChange);

        LeaguesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
        CountriesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
    },

    _onCall: function (call) {
        _calls.push(call);

        if (_calls.length == 3) {
            $.when(_calls[0], _calls[1], _calls[2]).done(function () {
                _deferred.resolve();
            }.bind(this));
        }
    },

    _onChange: function () {
        _deferred.then(function () {
            this.setState({
                leagues:     LeaguesStore.getAll(),
                countries:   CountriesStore.getAll(),
                tournaments: TournamentStore.getAll()
            });
        }.bind(this));
    },

    _onEdit: function(e) {
        this.setState({
            selectedTournament: this.state.tournaments.filter(function (tournament) {
                return tournament._id == e.currentTarget.dataset.id;
            }).pop()
        });
    },

    render: function () {
        var tabItems = this.state.leagues.map(function (league) {

            var tournamentsItems = this.state.tournaments.filter(function (tournament) {
                return tournament.leagueId == league._id;
            }).map(function (tournament) {
                return (
                    <TournamentItem tournament={tournament} onEdit={this._onEdit} key={tournament._id} />
                );
            }.bind(this));

            var countries = this.state.countries.filter(function(country) {
                return country.leagueId == league._id;
            });

            return (
                <Tab label={league.name} key={league._id}>
                    <TournamentNew
                        tournament={this.state.selectedTournament}
                        countries={countries}
                        leagueId={league._id}
                        key={this.state.selectedTournament._id} />

                    <ReactTransitionGroup transitionName="fadeIn">
                        {tournamentsItems}
                    </ReactTransitionGroup>
                </Tab>
            );
        }.bind(this));

        return (
            <Tabs>{tabItems}</Tabs>
        );
    }
});

module.exports = TournamentApp;
