import _ from 'lodash';
import React, { Component, PropTypes} from 'react';

import Toolbar, { ToolbarGroup } from 'material-ui/Toolbar';
import Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';

import AutoComplete from '../AutoComplete.jsx';
import DropDownMenu from '../DropDownMenu.jsx';

import GamesStore from'../../stores/GamesStore';

class GamesToolbar extends Component {

    static propTypes = {
        leagueId:     PropTypes.string.isRequired,
        countries:    PropTypes.array.isRequired,
        games:        PropTypes.array.isRequired,
        onGameSelect: PropTypes.func
    };

    state = {
        hasTournament:    false,
        countries:        [],
        tournaments:      [],
        games:            [],
        countryIndex:     0,
        tournamentIndex:  0,
        game:             {},
        gamesSuggestions: []
    };

    constructor(props) {
        super(props);

        this._onCountrySelect    = this._onCountrySelect.bind(this);
        this._onGameSelect       = this._onGameSelect.bind(this);
        this._onTournamentSelect = this._onTournamentSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.countries.length) {
            return;
        }

        const countries = nextProps.countries
            .map(item => ({text: item.name, _id: item._id, tournaments: item.tournaments}));

        this.setState({countries: countries});

        const countryIndex = 0;

        if (countries.length && !!countries[countryIndex]) {
            const state = this._updatedCountryState(countries, countryIndex);

            this.setState(state);
        }
    }

    _onCountrySelect(e, index) {
        const state = this._updatedCountryState(this.state.countries, index);

        this.setState(state);
    }

    _onTournamentSelect(e, index) {
        this.setState(this._updatedTournamentState(this.state.tournaments[index], index));
    }

    _updatedCountryState(countries, index) {
        let country     = countries[index],
            tournaments = country.tournaments;

        tournaments = tournaments.filter(t => t.show).map(function (item) {
            return {text: item.name, _id: item._id};
        });

        let state = {
            countryIndex: index,
            tournaments:  tournaments
        };

        const tournamentIndex = 0;

        if (state.tournaments.length && !!state.tournaments[tournamentIndex]) {
            state = _.extend(state, this._updatedTournamentState(state.tournaments[tournamentIndex], tournamentIndex));
        } else {
            state = _.extend(state, {hasTournament: false});
        }

        return state;
    }

    _updatedTournamentState(tournament, index) {
        const games = this.props.games
            .filter(item => item.tournamentId == tournament._id)
            .filter(item => item.teams.length == 2 && item.teams[0] && item.teams[1])
            .map(item => {
                let text = `${item.teams[0].name} - ${item.teams[1].name} (${item.tourText})`;
                let score;

                if (item.score) {
                    score = `${item.score.ft[0]}:${item.score.ft[1]}`;
                }
                item.text  = text;
                item.value = (<AutoComplete.Item primaryText={text} secondaryText={score}/>);

                return item;
            });
        return {
            tournamentIndex:  index,
            hasTournament:    true,
            gamesSuggestions: games
        };
    }

    _onGameSelect(gameString) {
        const tournament = this.state.tournaments[this.state.tournamentIndex];
        const game       = GamesStore.getByTournament(this.props.leagueId, tournament._id)[this.state.gamesSuggestions.indexOf(gameString)];

        if (this.props.onGameSelect) {
            this.props.onGameSelect(game);
        }
    }

    render() {
        const styles = this.getStyles();

        const countriesOptions = this.props.countries
            .map(item => ({text: item.name, _id: item._id, tournaments: item.tournaments}));

        const countriesMenu =
                  <DropDownMenu
                      style={styles.dropdownCountries.root}
                      labelStyle={styles.dropdownCountries.item}
                      menuItemStyle={styles.dropdownCountries.item}
                      noItemStyle={styles.dropdownCountries.noItemStyle}
                      singleItemStyle={styles.dropdownCountries.singleItemStyle}
                      iconStyle={styles.dropdownCountries.icon}
                      menuItems={countriesOptions}
                      selectedIndex={this.state.countryIndex}
                      noDataText="Нет стран"
                      onChange={this._onCountrySelect}/>;

        const tournamentsMenu =
                  <DropDownMenu
                      style={styles.dropdownTournaments.root}
                      labelStyle={styles.dropdownTournaments.item}
                      menuItemStyle={styles.dropdownTournaments.item}
                      noItemStyle={styles.dropdownCountries.noItemStyle}
                      singleItemStyle={styles.dropdownCountries.singleItemStyle}
                      iconStyle={styles.dropdownTournaments.icon}
                      menuItems={this.state.tournaments}
                      onChange={this._onTournamentSelect}
                      noDataText="Нет турниров"
                      selectedIndex={this.state.tournamentIndex}/>;

        const gamesInput = this.state.hasTournament && this.state.gamesSuggestions.length ?
            <AutoComplete
                suggestions={this.state.gamesSuggestions}
                secondaryField={game => `${game.score.ft[0]}:${game.score.ft[1]}`}
                style={styles.autoComplete.input}
                key={`${this.props.leagueId}-${this.state.tournaments[this.state.tournamentIndex]._id}`}/> :

            <span style={styles.autoComplete.holder}>Загружается список команд...</span>;

        return (
            <Toolbar style={styles.root} key={`${this.props.leagueId}-toolbar`}>
                <ToolbarGroup style={styles.toolbarGroup}>
                    {countriesMenu}
                    {tournamentsMenu}
                    <div style={styles.autoComplete.container}>
                        {gamesInput}
                    </div>

                </ToolbarGroup>
            </Toolbar>
        );
    }

    getStyles() {
        return {
            root:                {
                marginBottom: Spacing.desktopGutter,
                padding:      0
            },
            toolbarGroup:        {
                width: '100%'
            },
            dropdownCountries:   {
                root:            {
                    height:      Spacing.desktopToolbarHeight,
                    lineHeight:  `${Spacing.desktopToolbarHeight}px`,
                    width:       '30%',
                    marginRight: '2%',
                    color:       Colors.lightBlack
                },
                icon:            {
                    fill: Colors.lightBlack
                },
                item:            {
                    color: Colors.lightBlack
                },
                noItemStyle:     {
                    boxSizing:   'border-box',
                    width:       '30%',
                    marginRight: '2%',
                    float:       'left',
                    paddingLeft: Spacing.desktopGutter,
                    lineHeight:  '56px',
                    fontSize:    15,
                    color:       Colors.lightBlack
                },
                singleItemStyle: {
                    boxSizing:   'border-box',
                    width:       '30%',
                    marginRight: '2%',
                    float:       'left',
                    paddingLeft: Spacing.desktopGutter,
                    lineHeight:  '56px',
                    fontSize:    15,
                    color:       Colors.lightBlack
                }
            },
            dropdownTournaments: {
                root: {
                    height:      Spacing.desktopToolbarHeight,
                    lineHeight:  `${Spacing.desktopToolbarHeight}px`,
                    width:       '30%',
                    marginRight: '2%',
                    color:       Colors.lightBlack
                },
                icon: {
                    fill: Colors.lightBlack
                },
                item: {
                    color: Colors.lightBlack
                }
            },
            autoComplete:        {
                container: {
                    width:  '36%',
                    height: Spacing.desktopToolbarHeight,
                    float:  'left'
                },
                input:     {
                    lineHeight: `${Spacing.desktopToolbarHeight}px`
                },
                holder:    {
                    height:     Spacing.desktopToolbarHeight,
                    lineHeight: `${Spacing.desktopToolbarHeight}px`,
                    width:      '40%',
                    color:      Colors.lightBlack,
                    fontSize:   15
                }
            }
        }
    }
}

module.exports = GamesToolbar;
