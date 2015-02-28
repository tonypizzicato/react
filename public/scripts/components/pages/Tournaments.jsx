"use strict";

var $                    = require('jquery'),
    React                = require('react'),
    Router               = require('react-router'),
    mui                  = require('material-ui'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    Dragon               = require('react-dragon'),

    Tabs                 = mui.Tabs,
    Tab                  = mui.Tab,
    DropDownMenu         = mui.DropDownMenu,

    EventsConstants      = require('../../constants/EventsConstants'),
    //LeaguesActions       = require('../../actions/LeaguesActions'),
    //LeaguesStore         = require('../../stores/LeaguesStore'),
    CountriesActions     = require('../../actions/CountriesActions'),
    CountriesStore       = require('../../stores/CountriesStore'),
    TournamentsActions   = require('../../actions/TournamentsActions'),
    TournamentStore      = require('../../stores/TournamentsStore'),

    TournamentNew        = require('../tournaments/TournamentNew.jsx'),
    TournamentsList      = require('../tournaments/TournamentsList.jsx');

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
            //leagues:            [],
            countries:          [],
            tournaments:        [],
            selectedTournament: {}
        }
    },

    componentDidMount: function () {
        _calls = [];
        _deferred = new $.Deferred();

        _deferred.then(function () {
            this.setState({
                //leagues:            LeaguesStore.getAll(),
                countries:          CountriesStore.getAll(),
                tournaments:        TournamentStore.getAll(),
                selectedTournament: this.getInitialState().selectedTournament
            });
        }.bind(this));

        TournamentStore.addChangeListener(this._onChange);

        //LeaguesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);
        CountriesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.addListener(EventsConstants.EVENT_CALL, this._onCall);

        if (this.props.leagues.length) {
            CountriesActions.load();
            TournamentsActions.load();
        }
    },

    componentWillUnmount: function () {
        TournamentStore.removeChangeListener(this._onChange);

        //LeaguesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
        CountriesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
    },

    componentWillReceiveProps: function (nextProps) {
        console.log('RECEIVED NEW PROPS');
        if (nextProps.leagues.length !== this.props.leagues.length) {
            // Load entities
            //LeaguesActions.load();
            CountriesActions.load();
            TournamentsActions.load();
        }
    },

    _onCall: function (call) {
        _calls.push(call);

        if (_calls.length == 2) {
            $.when(_calls[0], _calls[1]/*, _calls[2]*/).done(function () {
                _deferred.resolve();
            }.bind(this));
        }
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

    render: function () {
        console.log("TOURNAMENTS RENDERING");
        var tabItems = this.props.leagues.map(function (league) {

            var tournamentsItems = this.state.tournaments.filter(function (tournament) {
                return tournament.leagueId == league._id;
            }.bind(this));

            var countries = this.state.countries.filter(function (country) {
                return country.leagueId == league._id;
            });

            return (
                <Tab label={league.name} key={league._id}>
                    <TournamentNew
                        tournament={this.state.selectedTournament}
                        countries={countries}
                        leagueId={league._id}
                        key={this.state.selectedTournament._id + '-edit'} />

                    <ReactTransitionGroup transitionName="fadeIn">
                        <TournamentsList tournaments={tournamentsItems} onEdit={this._onEdit} />
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
