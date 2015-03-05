"ues strict";

var _                   = require('underscore'),
    React               = require('react'),
    mui                 = require('material-ui'),

    Authentication      = require('../Auth.jsx').Authentication,

    Typeahead           = require('react-typeahead').Typeahead,

    Paper               = mui.Paper,
    Tabs                = mui.Tabs,
    Tab                 = mui.Tab,
    Toolbar             = mui.Toolbar,
    ToolbarGroup        = mui.ToolbarGroup,
    DropDownMenu        = mui.DropDownMenu,
    Button              = mui.RaisedButton,

    Editor              = require('../MediumEditor.jsx'),
    GameArticleForm     = require('../game-articles/GameArticleForm.jsx'),

    CountriesStore      = require('../../stores/CountriesStore'),
    CountriesActions    = require('../../actions/CountriesActions'),

    GamesStore          = require('../../stores/GamesStore'),
    GamesActions        = require('../../actions/GamesActions'),

    GameArticlesStore   = require('../../stores/GameArticlesStore'),
    GameArticlesActions = require('../../actions/GameArticlesActions');


var GamesApp = React.createClass({

    mixins: [Authentication],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required
        }
    },

    getInitialState: function () {
        return {
            countries:          [],
            games:              [],
            articles:           [],
            selectedLeague:     0,
            selectedCountry:    0,
            selectedTournament: 0,
            selectedArticle:    {},
            selectedGame:       {},
            validation:         {}
        }
    },

    componentDidMount: function () {
        CountriesStore.addChangeListener(this._countriesChange);
        GameArticlesStore.addChangeListener(this._articleChange);
        GamesStore.addChangeListener(this._gamesChange);

        CountriesActions.load();
        GameArticlesActions.load();
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.leagues.length && !this.state.games.length) {
            nextProps.leagues.forEach(function (item) {
                GamesActions.load({leagueId: item._id});
            });
        }
    },

    componentWillUnmount: function () {
        CountriesStore.removeChangeListener(this._countriesChange);
        GameArticlesStore.removeChangeListener(this._articleChange);
        GamesStore.removeChangeListener(this._gamesChange);
    },

    _countriesChange: function () {
        this.setState({countries: CountriesStore.getAll()});
    },

    _gamesChange: function () {
        var games = GamesStore.getAll();

        games.sort(function (a, b) {
            return a.tourNumber <= b.tourNumber ? -1 : 1;
        });

        games.forEach(function (item) {
            if (item.teams.length != 2 || !item.teams[0] || !item.teams[1]) {
                console.warn('No team for game ' + item._id);
                return;
            }
            item.text = item.teams[0].name + ' - ' + item.teams[1].name + ' (' + item.tourNumber + ' tour)';
            if (item.score) {
                item.text += ' ' + item.score.ft[0] + ':' + item.score.ft[1];
            }
        });

        this.setState({games: games});
    },

    _articleChange: function () {
        console.dir(GameArticlesStore.getAll())
    },

    _onGameTabChange: function (e) {
        this.setState({selectedArticle: this.getInitialState().selectedArticle});
    },

    _onLeagueTabChange: function (leagueId) {
        this.setState({selectedLeague: leagueId});
    },

    _onCountrySelect: function (e, index) {
        this.setState({selectedCountry: index});

        if (this.state.countries[index].tournaments.length) {
            this._onTournamentSelect(null, 0);
        }
    },

    _onTournamentSelect: function (e, index) {
        this.setState({selectedTournament: index});
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    componentWillUpdate: function () {
    },

    _onArticleCancel: function () {
        this.setState({selectedArticle: this.getInitialState().selectedArticle});
    },

    _onGameChanged: function (string) {
        var game = _.findWhere(this.state.games, {text: string});

        this.setState({selectedGame: game});
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league, index) {
            var countries = this.state.countries.filter(function (item) {
                return item.leagueId == league._id;
            });
            var countryItems = countries.map(function (item) {
                return {text: item.name, id: item._id};
            }.bind(this));

            var tab;
            if (countries.length) {
                var tournaments = countries[this.state.selectedCountry] ? countries[this.state.selectedCountry].tournaments : [];

                var countriesMenu = countryItems.length > 1 ? (
                    <DropDownMenu menuItems={countryItems} onChange={this._onCountrySelect} selectedIndex={this.state.selectedCountry} />
                ) : (<span className="mui-label s_ml_24">{this.state.countries[0].name}</span>);

                var tournamentsMenu = this._tournamentsMenuComponent(tournaments);
                var gamesInput = this._gamesInputComponent(league, tournaments);
                var innerTabs = this._innerTabsComponent(tournaments);

                tab = (
                    <div>
                        <Toolbar className="s_mt_12">
                            <ToolbarGroup key={0} float="left">
                                {countriesMenu}
                                {tournamentsMenu}
                                {gamesInput}
                            </ToolbarGroup>
                        </Toolbar>
                        {innerTabs}
                    </div>
                );
            } else {
                tab = (
                    <div>No data to edit</div>
                )
            }

            return (<Tab label={league.name} onActive={this._onLeagueTabChange} index={index} key={league._id}>{tab}</Tab>);
        }.bind(this));

        return (
            <Tabs className="s_mb_24">{tabItems}</Tabs>
        );
    },

    _innerTabsComponent: function (tournaments) {
        if (!tournaments.length) {
            return '';
        }

        var preview = GameArticlesStore.get(this.state.selectedGame._id, 'preview'),
            review = GameArticlesStore.get(this.state.selectedGame._id, 'review');

        return (
            <Tabs className="s_mt_12" onChange={this._onGameTabChange}>
                <Tab label="Preview" key={this.state.selectedTournament + '-preview'}>
                    <GameArticleForm type="preview" game={this.state.selectedGame} article={preview} onCancel={this._onArticleCancel} />
                </Tab>
                <Tab label="Review" key={this.state.selectedTournament + '-review'}>
                    <GameArticleForm type="review" game={this.state.selectedGame} article={review} onCancel={this._onArticleCancel} />
                </Tab>
                <Tab label="Media" key={this.state.selectedTournament + '-photo'}>
                    photo uploader
                </Tab>
            </Tabs>
        );
    },

    _tournamentsMenuComponent: function (tournaments) {
        if (!tournaments.length) {
            return '';
        }

        var tournamentsItems = tournaments.map(function (item) {
            return {text: item.name, id: item._id};
        });

        return tournamentsItems.length > 1 ? (
            <DropDownMenu menuItems={tournamentsItems} onChange={this._onTournamentSelect} selectedIndex={this.state.selectedTournament} />
        ) : (<span className="mui-label s_ml_24">{tournaments[0].name}</span>);
    },

    _gamesInputComponent: function (league, tournaments) {
        if (!tournaments.length) {
            return '';
        }

        var selectedTournament = this.state.selectedTournament;
        var gamesItems = this.state.games
            .filter(function (item) {
                return item.tournamentId == tournaments[selectedTournament]._id;
            })
            .map(function (item) {
                return item.text;
            });

        if (!gamesItems.length) {
            return '';
        }

        return (
            <Typeahead
                className="mui-text-field"
                options={gamesItems}
                placeholder="Input teams names"
                onOptionSelected={this._onGameChanged}
                customClasses={{
                    input:    'mui-text-field-input',
                    results:  's_position_absolute',
                    listItem: ''
                }}
                key={league._id + '-' + tournaments[this.state.selectedTournament]._id} />
        );
    }
});

module.exports = GamesApp;
