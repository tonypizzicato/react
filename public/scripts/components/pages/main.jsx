"use strict";

var _              = require('underscore'),
    React          = require('react'),
    Router         = require('react-router'),
    mui            = require('material-ui'),

    Link           = Router.Link,

    Canvas         = mui.AppCanvas,
    AppBar         = mui.AppBar,
    Icon           = mui.FontIcon,

    WithNav        = require('./with-nav.jsx'),
    Auth           = require('../Auth.jsx').Auth,

    AuthStore      = require('../../stores/AuthStore'),

    LeaguesActions = require('../../actions/LeaguesActions'),
    LeaguesStore   = require('../../stores/LeaguesStore'),
    GamesActions   = require('../../actions/GamesActions'),
    GamesStore     = require('../../stores/GamesStore');

var menuItems = [
    {route: 'users', text: 'Пользователи'},
    {route: 'leagues', text: 'Лиги'},
    {route: 'countries', text: 'Страны'},
    {route: 'tournaments', text: 'Туриниры'},
    {route: 'news', text: 'Новости'},
    {route: 'games', text: 'Игры'},
    {route: 'contacts', text: 'Контакты'},
    {route: 'orders', text: 'Заявки'}
];

var MainApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            loggedIn: AuthStore.loggedIn(),
            leagues:  [],
            games:    []
        }
    },

    componentDidMount: function () {
        AuthStore.addChangeListener(this._authChange);
        LeaguesStore.addChangeListener(this._leaguesChange);
        GamesStore.addChangeListener(this._gamesChange);

        LeaguesActions.load();
    },

    componentWillUnmount: function () {
        AuthStore.removeChangeListener(this._authChange);
        LeaguesStore.removeChangeListener(this._leaguesChange);
        GamesStore.removeChangeListener(this._gamesChange);
    },

    _authChange: function () {
        this.setState({loggedIn: AuthStore.loggedIn()});
    },

    _leaguesChange: function () {
        var leagues = LeaguesStore.getAll();
        this.setState({leagues: leagues});
        GamesActions.load({leagueId: _.findWhere(leagues, {slug: 'moscow'})._id});
    },

    _gamesChange: function () {
        this.setState({games: GamesStore.getAll()});
    },

    render: function () {

        var loginOrOut = this.state.loggedIn ?
            <Link to="logout">Выход</Link> :
            <Link to="login">Вход</Link>;

        var content = '';
        if (this.state.loggedIn) {
            content = (<WithNav menuItems={menuItems} leagues={this.state.leagues} games={this.state.games} />)
        } else {
            content = <Auth />
        }

        return (
            <div>
                <Canvas>
                    <AppBar className="mui-dark-theme" title="Панель управления Amateur" zDepth={0}>
                        <div className="login">
                            <Icon className="mdfi_action_account_circle" />
                            {loginOrOut}
                        </div>
                    </AppBar>
                    {content}
                </Canvas>
            </div>
        )
    }
});

module.exports = MainApp;
