"ues strict";

var React               = require('react'),
    mui                 = require('material-ui'),

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
            selectedCountry:    0,
            selectedTournament: 0,
            selectedArticle:    {},
            selectedGame:       null,
            validation:         {}
        }
    },

    componentDidMount: function () {
        CountriesStore.addChangeListener(this._countriesChange);
        GameArticlesStore.addChangeListener(this._articleChange);
        GamesStore.addChangeListener(this._gamesChange);

        CountriesActions.load();
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.leagues.length !== this.props.leagues.length) {
            GamesActions.load({leagueId: nextProps.leagues[0]._id});
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
        this.setState({games: GamesStore.getAll()});
    },

    _articleChange: function () {
        console.dir(GameArticlesStore.getAll())
    },

    _onGameTabChange: function (e) {
        this.setState({selectedArticle: this.getInitialState().selectedArticle});
    },

    _onCountrySelect: function (e, index) {
        this.setState({selectedCountry: index});

        if (this.state.countries[index].tournaments.length) {
            this._onTournamentSelect(null, 0);
        }
    },

    _onTournamentSelect: function (e, index) {
        this.setState({selectedTournament: index});

        GameArticlesActions.load();
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    componentWillUpdate: function () {
    },

    _onArticleCancel: function () {
        this.setState({selectedArticle: this.getInitialState().selectedArticle});
    },

    _onGameChanged: function (e) {
        console.dir(e);
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {
            var countries = this.state.countries.filter(function (item) {
                return item.leagueId == league._id;
            });
            var countryItems = countries.map(function (item) {
                return {text: item.name, id: item._id};
            }.bind(this));

            var tab;
            if (countries.length) {
                var tournaments = countries[this.state.selectedCountry] ? countries[this.state.selectedCountry].tournaments : [];

                var tournamentsItems = tournaments.map(function (item) {
                    return {text: item.name, id: item._id};
                });

                var gamesItems = tournaments.length ? this.state.games.filter(function (item) {
                    return item.tournamentId == tournaments[this.state.selectedTournament]._id;
                }.bind(this))
                    .map(function (item) {
                        return item.teams[0].name + ' - ' + item.teams[1].name + ' (' + item.tourNumber + ')';
                    }) : [];

                var countriesMenu = countryItems.length > 1 ? (
                    <DropDownMenu menuItems={countryItems} onChange={this._onCountrySelect} selectedIndex={this.state.selectedCountry} />
                ) : (<span className="mui-label s_ml_24">{this.state.countries[0].name}</span>);

                var tournamentsMenu = '';
                var gamesInput = '';
                var innerTabs = '';
                if (tournamentsItems.length) {
                    tournamentsMenu = tournamentsItems.length > 1 ? (
                        <DropDownMenu menuItems={tournamentsItems} onChange={this._onTournamentSelect} selectedIndex={this.state.selectedTournament} />
                    ) : (<span className="mui-label s_ml_24">{tournaments[0].name}</span>)

                    gamesInput = (
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
                            key={tournaments[this.state.selectedTournament]._id} />
                    );

                    innerTabs = (
                        <Tabs className="s_mt_12" onChange={this._onGameTabChange}>
                            <Tab label="Preview" key={this.state.selectedTournament + '-preview'}>
                                <GameArticleForm type="preview" article={this.state.selectedArticle} onCancel={this._onArticleCancel} />
                            </Tab>
                            <Tab label="Review" key={this.state.selectedTournament + '-review'}>
                                <GameArticleForm type="review" article={this.state.selectedArticle} onCancel={this._onArticleCancel} />
                            </Tab>
                            <Tab label="Media" key={this.state.selectedTournament + '-photo'}>
                                photo uploader
                            </Tab>
                        </Tabs>
                    )
                }

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

            return (<Tab label={league.name} key={league._id}>{tab}</Tab>);
        }.bind(this));

        return (
            <Tabs className="s_mb_24">{tabItems}</Tabs>
        );
    }
});

module.exports = GamesApp;
