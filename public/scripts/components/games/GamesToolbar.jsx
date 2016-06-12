const _                = require('lodash'),
      React            = require('react'),
      cx               = require('classnames'),
      mui              = require('material-ui'),

      Spacing          = mui.Styles.Spacing,
      Colors           = mui.Styles.Colors,

      Toolbar          = mui.Toolbar,
      ToolbarGroup     = mui.ToolbarGroup,

      Typeahead        = require('react-typeahead').Typeahead,

      DropDownMenu     = require('../DropDownMenu.jsx'),

      CountriesStore   = require('../../stores/CountriesStore'),
      CountriesActions = require('../../actions/CountriesActions'),

      GamesStore       = require('../../stores/GamesStore');

class GamesToolbar extends React.Component {

    static propTypes = {
        leagueId:     React.PropTypes.string.isRequired,
        games:        React.PropTypes.string.isRequired,
        onGameSelect: React.PropTypes.func
    };

    static defaultProps = {
        games: []
    };

    state = {
        mounted:         false,
        gamesLoading:    false,
        hasTournament:   false,
        countries:       [],
        tournaments:     [],
        games:           [],
        countryIndex:    0,
        tournamentIndex: 0,
        game:            {}
    };

    constructor(props) {
        super(props);

        this._onCountriesLoad    = this._onCountriesLoad.bind(this);
        this._onGamesLoad        = this._onGamesLoad.bind(this);
        this._onCountrySelect    = this._onCountrySelect.bind(this);
        this._onGameSelect       = this._onGameSelect.bind(this);
        this._onTournamentSelect = this._onTournamentSelect.bind(this);
    }

    componentDidMount() {
        this.setState({mounted: true});

        CountriesStore.addChangeListener(this._onCountriesLoad);
        GamesStore.addChangeListener(this._onGamesLoad);

        if (!this.state.gamesLoading) {
            CountriesActions.load();
            this.setState({gamesLoading: true});
        }
    }

    componentWillUnmount() {
        this.setState({mounted: false});

        CountriesStore.removeChangeListener(this._onCountriesLoad);
        GamesStore.removeChangeListener(this._onGamesLoad);
    }

    _onCountriesLoad() {
        const countries = CountriesStore.getByLeague(this.props.leagueId).map(item => {
            return {text: item.name, _id: item._id, tournaments: item.tournaments};
        });

        this.setState({countries: countries, gamesLoading: false});

        const countryIndex = 0;

        if (countries.length && !!countries[countryIndex]) {
            const state = this._updatedCountryState(countryIndex);

            this.setState(state);
        }
    }

    _onGamesLoad() {
        const countryIndex = 0;

        if (this.state.countries.length && !!this.state.countries[countryIndex]) {
            const state = this._updatedCountryState(countryIndex);

            this.setState(state);
        }
    }

    _onCountrySelect(e, index) {
        const state = this._updatedCountryState(index);

        this.setState(state);
    }

    _onTournamentSelect(e, index) {
        this.setState(this._updatedTournamentState(this.state.tournaments[index], index));
    }

    _updatedCountryState(index) {
        let country     = this.state.countries[index],
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
        const games = GamesStore.getByTournament(this.props.leagueId, tournament._id)
            .filter(function (item) {
                return item.teams.length == 2 && item.teams[0] && item.teams[1];
            })
            .map(function (item) {
                let text = `${item.teams[0].name} - ${item.teams[1].name} (${item.tourText})`;
                if (item.score) {
                    text += ` ${item.score.ft[0]}:${item.score.ft[1]}`;
                }
                item.display = text;
                item.filter  = `${item.teams[0].name} ${item.teams[1].name} (${item.tourText})`;

                return item;
            });
        return {
            tournamentIndex: index,
            hasTournament:   true,
            games:           games
        };
    }

    _onGameSelect(gameString) {
        const tournament = this.state.tournaments[this.state.tournamentIndex];
        const game       = GamesStore.getByTournament(this.props.leagueId, tournament._id)[this.state.games.indexOf(gameString)];

        if (this.props.onGameSelect) {
            this.props.onGameSelect(game);
        }
    }

    shouldComponentUpdate() {
        return !this.state.gamesLoading;
    }

    render() {
        const styles = this.getStyles();

        const countriesMenu =
                  <DropDownMenu
                      style={styles.dropdownCountries.root}
                      labelStyle={styles.dropdownCountries.item}
                      menuItemStyle={styles.dropdownCountries.item}
                      noItemStyle={styles.dropdownCountries.noItemStyle}
                      singleItemStyle={styles.dropdownCountries.singleItemStyle}
                      iconStyle={styles.dropdownCountries.icon}
                      menuItems={this.state.countries}
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

        const gamesInput = this.state.hasTournament && this.state.games.length ?
            <Typeahead
                options={this.state.games}
                placeholder="Введите название команд"
                onOptionSelected={this._onGameSelect}
                filterOption="filter"
                displayOption="display"
                customClasses={{
                    input:    'typeahead__input',
                    results:  'typeahead__results'
                }}
                key={`${this.props.leagueId}-${this.state.tournaments[this.state.tournamentIndex]._id}`}/> :
            <span style={styles.typeahead.holder}>Загружается список команд...</span>;

        return (
            <Toolbar style={styles.root} key={`${this.props.leagueId}-toolbar`}>
                <ToolbarGroup style={styles.toolbarGroup}>
                    {countriesMenu}
                    {tournamentsMenu}
                    <div style={styles.typeahead.container}>
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
            typeahead:           {
                container: {
                    width:  '36%',
                    height: 56,
                    float:  'left'
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
