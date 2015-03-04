"use strict";

var React          = require('react'),
    Router         = require('react-router'),
    mui            = require('material-ui'),

    Link           = Router.Link,

    Canvas         = mui.AppCanvas,
    AppBar         = mui.AppBar,

    WithNav        = require('./with-nav.jsx'),

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
            loggedIn: false,
            leagues:  []
        }
    },

    componentDidMount: function () {
        LeaguesStore.addChangeListener(this._leaguesChange);
        LeaguesActions.load();
    },

    componentWillUnmount: function () {
        LeaguesStore.removeChangeListener(this._leaguesChange);
    },

    _leaguesChange: function () {
        this.setState({leagues: LeaguesStore.getAll()});
    },

    render: function () {

        var loginOrOut = this.state.loggedIn ?
            <Link to="logout">Log out</Link> :
            <Link to="login">Sign in</Link>;

        console.log('MAIN RENDERING');
        return (
            <div>
                <Canvas>
                    <AppBar className="mui-dark-theme" title="Amateur Admin App" zDepth={0}>
                    {loginOrOut}
                    </AppBar>

                    <WithNav
                        menuItems={menuItems}
                        leagues={this.state.leagues} />
                </Canvas>
            </div>
        )
    }
});

module.exports = MainApp;
