"use strict";

var _                = require('underscore'),
    assign           = require('object-assign'),
    React            = require('react'),
    mui              = require('material-ui'),

    Toolbar          = mui.Toolbar,
    ToolbarGroup     = mui.ToolbarGroup,

    Typeahead        = require('react-typeahead').Typeahead,

    DropDownMenu     = require('../DropDownMenu.jsx'),

    CountriesStore   = require('../../stores/CountriesStore'),
    CountriesActions = require('../../actions/CountriesActions'),

    GamesStore       = require('../../stores/GamesStore'),
    GamesActions     = require('../../actions/GamesActions');

var GamesToolbar = React.createClass({

    propTypes: function () {
        return {
            leagueId:     React.PropTypes.string.required,
            onGameSelect: React.PropTypes.func
        }
    },

    getDefaultProps: function () {
        return {}
    },

    getInitialState: function () {
        return {
            gamesLoading:    false,
            hasTournament:   false,
            countries:       [],
            tournaments:     [],
            games:           [],
            countryIndex:    0,
            tournamentIndex: 0,
            game:            {}
        }
    },

    componentDidMount: function () {
        CountriesStore.addChangeListener(this._onCountriesLoad);
        GamesStore.addChangeListener(this._onGamesLoad);

        if (!this.state.gamesLoading) {
            GamesActions.load({leagueId: this.props.leagueId});
            this.setState({gamesLoading: true});
        }
    },

    componentWillUnmount: function () {
        CountriesStore.removeChangeListener(this._onCountriesLoad);
        GamesStore.removeChangeListener(this._onGamesLoad);
    },

    _onCountriesLoad: function () {
        var countries = CountriesStore.getByLeague(this.props.leagueId)
            .map(function (item) {
                return {text: item.name, _id: item._id, tournaments: item.tournaments};
            }.bind(this));

        this.setState({countries: countries});

        if (countries.length && !!countries[this.getInitialState().countryIndex]) {
            var state = this._updatedCountryState(this.getInitialState().countryIndex);

            this.setState(state);
        }
    },

    _onGamesLoad: function () {
        CountriesActions.load();
        this.setState({gamesLoading: false});
    },

    _onCountrySelect: function (e, index) {
        var state = this._updatedCountryState(index);

        this.setState(state);
    },

    _onTournamentSelect: function (e, index) {
        this.setState(this._updatedTournamentState(this.state.tournaments[index], index));
    },

    _updatedCountryState: function (index) {
        var country     = this.state.countries[index],
            tournaments = country.tournaments;

        tournaments = tournaments.map(function (item) {
            return {text: item.name, _id: item._id};
        });

        var state = {
            countryIndex: index,
            tournaments:  tournaments
        };

        var tournamentIndex = this.getInitialState().tournamentIndex;

        if (state.tournaments.length && !!state.tournaments[tournamentIndex]) {
            state = assign(state, this._updatedTournamentState(state.tournaments[tournamentIndex], tournamentIndex));
        } else {
            state = assign(state, {hasTournament: false});
        }

        return state;
    },

    _updatedTournamentState: function (tournament, index) {
        var games = GamesStore.getByTournament(this.props.leagueId, tournament._id)
            .filter(function (item) {
                return item.teams.length == 2 && item.teams[0] && item.teams[1];
            })
            .map(function (item) {
                var text = item.teams[0].name + ' - ' + item.teams[1].name + ' (' + item.tourNumber + ' tour)';
                if (item.score) {
                    text += ' ' + item.score.ft[0] + ':' + item.score.ft[1];
                }

                return text;
            });

        return {
            tournamentIndex: index,
            hasTournament:   true,
            games:           games
        };
    },

    _onGameSelect: function (gameString) {
        var tournament = this.state.tournaments[this.state.tournamentIndex];
        var game       = GamesStore.getByTournament(this.props.leagueId, tournament._id)[this.state.games.indexOf(gameString)];

        if (this.props.onGameSelect) {
            this.props.onGameSelect(game);
        }
    },

    shouldComponentUpdate: function () {
        return !this.state.gamesLoading;
    },

    render: function () {
        console.log('GamesToolbar rendering ' + this.props.leagueId);

        var countriesMenu =
                <DropDownMenu
                    menuItems={this.state.countries}
                    selectedIndex={this.state.countryIndex}
                    noDataText="No Countries"
                    onChange={this._onCountrySelect}/>;

        var tournamentsMenu =
                <DropDownMenu
                    menuItems={this.state.tournaments}
                    onChange={this._onTournamentSelect}
                    noDataText="No Tournaments"
                    selectedIndex={this.state.tournamentIndex}/>;

        var gamesInput = this.state.hasTournament ?
            <Typeahead
                className="mui-text-field"
                options={this.state.games}
                placeholder="Input teams names"
                onOptionSelected={this._onGameSelect}
                customClasses={{
                        input:    'mui-text-field-input',
                        results:  's_position_absolute',
                        listItem: ''
                    }}
                key={this.props.leagueId + '-' + this.state.tournaments[this.state.tournamentIndex]._id}/> : '';

        return (
            <Toolbar className="s_mt_12">
                <ToolbarGroup float="left">
                    {countriesMenu}
                    {tournamentsMenu}
                    {gamesInput}
                </ToolbarGroup>
            </Toolbar>
        );
    }
});

module.exports = GamesToolbar;