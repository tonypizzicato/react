"use strict";

var React        = require('react'),
    Router       = require('react-router'),

    Route        = Router.Route,
    DefaultRoute = Router.DefaultRoute,

    MainApp      = require('./components/pages/main.jsx'),
    UsersApp     = require('./components/pages/users.jsx'),
    NewsApp      = require('./components/pages/news.jsx'),
    MediaApp     = require('./components/pages/media.jsx');

var Routes = (
    <Route name="root" path="/" handler={MainApp}>
        <Route name="users" handler={UsersApp} />
        <Route name="news" handler={NewsApp} />
        <Route name="media" handler={MediaApp} />

        <DefaultRoute handler={UsersApp}/>
    </Route>
);


module.exports = Routes;