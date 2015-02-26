"ues strict";

var React            = require('react'),
    mui              = require('material-ui'),
    Editor           = require('colonel-kurtz'),

    Paper            = mui.Paper,
    Tabs             = mui.Tabs,
    Tab              = mui.Tab,
    Toolbar          = mui.Toolbar,
    ToolbarGroup     = mui.ToolbarGroup,
    DropDownMenu     = mui.DropDownMenu,

    CountriesStore   = require('../../stores/CountriesStore'),
    CountriesActions = require('../../actions/CountriesActions'),

    GamesStore       = require('../../stores/GamesStore'),
    GamesActions     = require('../../actions/GamesActions');

Editor.addBlockType({
    id:        'medium',
    icon:      'images/icons/text.svg',
    label:     'Create a new text block',
    component: require('colonel-kurtz/build/addons/medium')
});

Editor.addBlockType({
    id:        'image',
    icon:      'images/icons/image.svg',
    label:     'Create a new image block',
    component: require('colonel-kurtz/build/addons/image')
});

Editor.addBlockType({
    id:        'youtube',
    icon:      'images/icons/youtube.svg',
    label:     'Create a new YouTube block',
    component: require('colonel-kurtz/build/addons/youtube')
});

var GamesApp = React.createClass({

    getInitialState: function () {
        return {
            countries:          [],
            games:              [],
            selectedCountry:    0,
            selectedTournament: 0,
            selectedGame:       null
        }
    },

    componentDidMount: function () {
        CountriesStore.addChangeListener(this._countriesChange);
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
        GamesStore.removeChangeListener(this._gamesChange);
    },

    _countriesChange: function () {
        this.setState({countries: CountriesStore.getAll()});
    },

    _gamesChange: function () {
        this.setState({games: GamesStore.getAll()});
    },

    _onCountrySelect: function (e, index) {
        this.setState({selectedCountry: index});
    },

    _onTournamentSelect: function (e, index) {
        this.setState({selectedTournament: index});
    },

    componentWillUpdate: function () {
        if (this.refs.hasOwnProperty('editor-preview')) {
            this._editorPreview = new Editor({
                el:    this.refs['editor-preview'].getDOMNode(),
                types: ['medium', 'image', 'youtube']
            }).render();
        }
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {
            var countryItems = this.state.countries.map(function (item) {
                return {text: item.name, id: item._id};
            }.bind(this));

            var tab;
            if (countryItems.length) {
                var tournaments = this.state.countries[this.state.selectedCountry].tournaments;

                var tournamentsItems = tournaments.map(function (item) {
                    return {text: item.name, id: item._id};
                });

                var countriesMenu = '';
                if (countryItems.length) {
                    countriesMenu = countryItems.length > 1 ? (
                        <DropDownMenu menuItems={countryItems} onChange={this._onCountrySelect} selectedIndex={this.state.selectedCountry} />
                    ) : (<span>{this.state.countries[0].name}</span>);
                }

                var tournamentsMenu = '';
                var innerTabs = '';
                if (tournamentsItems.length) {
                    tournamentsMenu = tournamentsItems.length > 1 ? (
                        <DropDownMenu menuItems={tournamentsItems} onChange={this._onTournamentSelect} selectedIndex={this.state.selectedTournament} />
                    ) : (<span className="mui-label">{tournaments[0].name}</span>)


                    innerTabs = (
                        <Tabs className="s_mt_12">
                            <Tab label="Preview" key={this.state.selectedTournament + '-preview'}>
                                <div ref="editor-preview" />
                            </Tab>
                            <Tab label="Preview" key={this.state.selectedTournament + '-review'}>
                                <div ref="editor-review" />
                            </Tab>
                            <Tab label="Preview" key={this.state.selectedTournament + '-photo'}>
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
            <Tabs>{tabItems}</Tabs>
        );
    }
});

module.exports = GamesApp;