const _                = require('lodash'),
      React            = require('react'),
      cx               = require('classnames'),
      mui              = require('material-ui'),

      Toolbar          = mui.Toolbar,
      ToolbarGroup     = mui.ToolbarGroup,

      Typeahead        = require('react-typeahead').Typeahead,

      DropDownMenu     = require('../DropDownMenu.jsx'),

      CountriesStore   = require('../../stores/CountriesStore'),
      CountriesActions = require('../../actions/CountriesActions'),

      GamesStore       = require('../../stores/GamesStore');

class GamesToolbar extends React.Component {

    static propTypes = {
        leagueId:     React.PropTypes.string.required,
        games:        React.PropTypes.string.required,
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
            var state = this._updatedCountryState(countryIndex);

            this.setState(state);
        }
    }

    _onCountrySelect(e, index) {
        const state = this._updatedCountryState(index);

        this.setState(state);
    }

    _onTournamentSelect(e, index) {
        this.setState(this._updatedTournamentState(index));
    }

    _updatedCountryState(index) {
        let country     = this.state.countries[index],
            tournaments = country.tournaments;

        tournaments = tournaments.map(function (item) {
            return {text: item.name, _id: item._id};
        });

        let state = {
            countryIndex: index,
            tournaments:  tournaments
        };

        const tournamentIndex = 0;

        if (state.tournaments.length && !!state.tournaments[tournamentIndex]) {
            state = _.extend(state, this._updatedTournamentState(tournamentIndex));
        } else {
            state = _.extend(state, {hasTournament: false});
        }

        return state;
    }

    _updatedTournamentState(tournament, index) {
        var games = GamesStore.getByTournament(this.props.leagueId, tournament._id);

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
        const countriesMenu =
                  <DropDownMenu
                      menuItems={this.state.countries}
                      selectedIndex={this.state.countryIndex}
                      noDataText="Нет стран"
                      onChange={this._onCountrySelect}/>;

        const tournamentsMenu =
                  <DropDownMenu
                      menuItems={this.state.tournaments}
                      onChange={this._onTournamentSelect}
                      noDataText="Нет турниров"
                      selectedIndex={this.state.tournamentIndex}/>;

        const gamesInput = this.state.hasTournament && this.state.games.length ?
            <Typeahead
                options={this.state.games}
                placeholder="Введите название команд"
                onOptionSelected={this._onGameSelect}
                filterOption={(inputValue, option) => {

                    }
                }
                displayOption={(option, index) => {
                    let text = `${option.teams[0].name} - ${option.teams[1].name} (' + ${option.tourText})`;
                    if (option.score) {
                        text += ` ${option.score.ft[0]}:${item.score.ft[1]}`;
                    }

                    return text
                }}
                customClasses={{
                    input:    'mui-text-field-input',
                    results:  's_position_absolute',
                    listItem: ''
                }}
                key={`${this.props.leagueId}-${this.state.tournaments[this.state.tournamentIndex]._id}`}/> :
            <span className="mui-label s_ml_24 s_mr_24">Загружается список команд</span>;

        const cls = cx({
            's_mt_12': true
        });

        return (
            <Toolbar className={cls} key={`${this.props.leagueId}-toolbar`}>
                <ToolbarGroup float="left">
                    {countriesMenu}
                    {tournamentsMenu}
                    {gamesInput}
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

module.exports = GamesToolbar;
