"use strict";

var React          = require('react'),
    Router         = require('react-router'),

    Route          = Router.Route,
    DefaultRoute   = Router.DefaultRoute,

    MainApp        = require('./components/pages/main.jsx'),
    CountriesApp   = require('./components/pages/Countries.jsx'),
    TournamentsApp = require('./components/pages/Tournaments.jsx'),
    UsersApp       = require('./components/pages/Users.jsx'),
    NewsApp        = require('./components/pages/News.jsx'),
    MediaApp       = require('./components/pages/media.jsx'),
    GamesApp       = require('./components/pages/Games.jsx'),
    Auth           = require('./components/Auth.jsx');

var Routes = (
    <Route name="root" path="/" handler={MainApp}>
        <Route name="signup" handler={Auth.SignUp}/>
        <Route name="login" handler={Auth.Login}/>
        <Route name="logout" handler={Auth.Logout}/>

        <Route name="users" handler={UsersApp} />
        <Route name="countries" handler={CountriesApp} />
        <Route name="tournaments" handler={TournamentsApp} />
        <Route name="news" handler={NewsApp} />
        <Route name="media" handler={MediaApp} />
        <Route name="games" handler={GamesApp} />

        <DefaultRoute handler={UsersApp}/>
    </Route>
);


module.exports = Routes;
