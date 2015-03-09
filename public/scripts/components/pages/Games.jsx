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
    Dropzone            = require('../Dropzone.jsx'),
    Photos              = require('../Photos.jsx'),
    GameArticleForm     = require('../game-articles/GameArticleForm.jsx'),

    CountriesStore      = require('../../stores/CountriesStore'),
    CountriesActions    = require('../../actions/CountriesActions'),

    PhotosStore         = require('../../stores/PhotosStore'),
    PhotosActions       = require('../../actions/PhotosActions'),

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
            gamesLoading:       false,
            countries:          [],
            games:              [],
            articles:           [],
            photos:             [],
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
        PhotosStore.addChangeListener(this._photosChange);

        CountriesActions.load();
        GameArticlesActions.load();
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.leagues.length && !this.state.gamesLoading) {
            nextProps.leagues.forEach(function (item) {
                GamesActions.load({leagueId: item._id});
            });

            this.setState({gamesLoading: true});
        }
    },

    componentWillUnmount: function () {
        CountriesStore.removeChangeListener(this._countriesChange);
        GameArticlesStore.removeChangeListener(this._articleChange);
        GamesStore.removeChangeListener(this._gamesChange);
        PhotosStore.removeChangeListener(this._photosChange);
    },

    _countriesChange: function () {
        this.setState({countries: CountriesStore.getAll()});
    },

    _gamesChange: function () {
        var games = GamesStore.getAll();

        for (var index in games) {
            games[index].sort(function (a, b) {
                return a.tourNumber <= b.tourNumber ? -1 : 1;
            });

            games[index].forEach(function (item) {
                if (item.teams.length != 2 || !item.teams[0] || !item.teams[1]) {
                    console.warn('No team for game ' + item._id);
                    return;
                }
                item.text = item.teams[0].name + ' - ' + item.teams[1].name + ' (' + item.tourNumber + ' tour)';
                if (item.score) {
                    item.text += ' ' + item.score.ft[0] + ':' + item.score.ft[1];
                }
            });
        }

        this.setState({games: games, gamesLoading: false});
    },

    _articleChange: function () {
        console.dir(GameArticlesStore.getAll())
    },

    _photosChange: function () {
        this.setState({photos: PhotosStore.getAll()});
    },

    _onGameTabChange: function (e) {
        this.setState({selectedArticle: this.getInitialState().selectedArticle});
    },

    _onLeagueTabChange: function (tab) {
        this.setState({
            selectedLeague:     tab.props.index,
            selectedCountry:    this.getInitialState().selectedCountry,
            selectedTournament: this.getInitialState().selectedTournament,
            selectedGame:       this.getInitialState().selectedGame
        });
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

    _onArticleCancel: function () {
        this.setState({
            selectedArticle: this.getInitialState().selectedArticle
        });
    },

    _onGameChanged: function (string) {
        var leagueId = this.props.leagues[this.state.selectedLeague]._id;
        var game = _.findWhere(this.state.games[leagueId], {text: string});

        this.setState({selectedGame: game});
        PhotosActions.load('games', game._id);
    },

    _onPhotosUpload: function () {
        if (this.state.selectedGame._id) {
            PhotosActions.load('games', this.state.selectedGame._id);
        }
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
                var selectedCountry = this.state.selectedLeague == index ? this.state.selectedCountry : 0;
                var tournaments = countries[selectedCountry] ? countries[selectedCountry].tournaments : [];

                var countriesMenu = countryItems.length > 1 ? (
                    <DropDownMenu menuItems={countryItems} onChange={this._onCountrySelect}
                        selectedIndex={selectedCountry}/>
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
            }

            return (
                <Tab label={league.name} onActive={this._onLeagueTabChange} index={index} key={league._id}>{tab}</Tab>);
        }.bind(this));

        return (
            <Tabs className="s_mb_24">{tabItems}</Tabs>
        );
    },

    _innerTabsComponent: function (tournaments) {
        if (!tournaments.length) {
            return '';
        }

        if (this.state.selectedGame._id) {
            var preview = GameArticlesStore.get(this.state.selectedGame._id, 'preview'),
                review = GameArticlesStore.get(this.state.selectedGame._id, 'review');

            return (
                <Tabs className="s_mt_12" onChange={this._onGameTabChange}>
                    <Tab label="Preview">
                        <GameArticleForm type="preview" game={this.state.selectedGame} article={preview}
                            onCancel={this._onArticleCancel} key={this.state.selectedTournament + '-preview'} />
                    </Tab>
                    <Tab label="Review">
                        <GameArticleForm type="review" game={this.state.selectedGame} article={review}
                            onCancel={this._onArticleCancel} key={this.state.selectedTournament + '-review'} />
                    </Tab>
                    <Tab label="Media" key={this.state.selectedTournament + '-photo'}>
                        <Dropzone
                            url={PhotosStore.getImagesUrl('games', this.state.selectedGame._id)}
                            onUpload={this._onPhotosUpload}
                            key={this.state.selectedGame._id + '-dropzone'}/>
                        <Photos
                            className="s_display_inline-block s_mt_12 s_mr_6 s_position_relative"
                            size="150"
                            photos={this.state.photos}
                            key={this.state.selectedGame._id + '-photos'}/>
                    </Tab>
                </Tabs>
            );
        } else {
            return (
                <div className="text_align_c font-weight_bold s_mt_24">Select game first</div>
            )
        }
    },

    _tournamentsMenuComponent: function (tournaments) {
        if (!tournaments.length) {
            return '';
        }

        var tournamentsItems = tournaments.map(function (item) {
            return {text: item.name, id: item._id};
        });

        return tournamentsItems.length > 1 ? (
            <DropDownMenu menuItems={tournamentsItems} onChange={this._onTournamentSelect}
                selectedIndex={this.state.selectedTournament}/>
        ) : (<span className="mui-label s_ml_24 s_mr_24">{tournaments[0].name}</span>);
    },

    _gamesInputComponent: function (league, tournaments) {
        if (!tournaments.length || !this.state.games[league._id]) {
            return '';
        }

        var selectedTournament = this.state.selectedTournament;
        var gamesItems = this.state.games[league._id]
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
                key={league._id + '-' + tournaments[this.state.selectedTournament]._id}/>
        );
    }
});

module.exports = GamesApp;
