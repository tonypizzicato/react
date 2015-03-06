"use strict";

var React          = require('react'),
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
    LeaguesStore   = require('../../stores/LeaguesStore');

var menuItems = [
    {route: 'users', text: 'Users'},
    {route: 'countries', text: 'Countries'},
    {route: 'tournaments', text: 'Tournaments'},
    {route: 'news', text: 'News'},
    {route: 'media', text: 'Media'},
    {route: 'games', text: 'Games'}
];

var MainApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            loggedIn: AuthStore.loggedIn(),
            leagues:  []
        }
    },

    componentDidMount: function () {
        AuthStore.addChangeListener(this._authChange);
        LeaguesStore.addChangeListener(this._leaguesChange);
        LeaguesActions.load();
    },

    componentWillUnmount: function () {
        AuthStore.removeChangeListener(this._authChange);
        LeaguesStore.removeChangeListener(this._leaguesChange);
    },

    _authChange: function () {
        this.setState({loggedIn: AuthStore.loggedIn()});
    },

    _leaguesChange: function () {
        this.setState({leagues: LeaguesStore.getAll()});
    },

    render: function () {

        var loginOrOut = this.state.loggedIn ?
            <Link to="logout">Logout</Link> :
            <Link to="login">Login</Link>;

        var content = '';
        if (this.state.loggedIn) {
            content = (<WithNav menuItems={menuItems} leagues={this.state.leagues} />)
        } else {
            content = <Auth />
        }

        console.log('MAIN RENDERING');
        return (
            <div>
                <Canvas>
                    <AppBar className="mui-dark-theme" title="Amateur Admin App" zDepth={0}>
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
