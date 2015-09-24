"use strict";

var React          = require('react'),
    Router         = require('react-router'),

    Route          = Router.Route,
    DefaultRoute   = Router.DefaultRoute,

    MainApp        = require('./components/pages/main.jsx'),
    ProfileApp     = require('./components/pages/Profile.jsx'),
    LeaguesApp     = require('./components/pages/Leagues.jsx'),
    CountriesApp   = require('./components/pages/Countries.jsx'),
    TournamentsApp = require('./components/pages/Tournaments.jsx'),
    UsersApp       = require('./components/pages/Users.jsx'),
    CategoriesApp  = require('./components/pages/Categories.jsx'),
    NewsApp        = require('./components/pages/News.jsx'),
    GamesApp       = require('./components/pages/Games.jsx'),
    ContactsApp    = require('./components/pages/Contacts.jsx'),
    FieldsApp      = require('./components/pages/Fields.jsx'),
    OrdersApp      = require('./components/pages/Orders.jsx'),
    Auth           = require('./components/Auth.jsx');

var Routes = (
    <Route name="root" path="/" handler={MainApp}>
        <Route name="signup" handler={Auth.SignUp}/>
        <Route name="login" handler={Auth.Login}/>
        <Route name="logout" handler={Auth.Logout}/>
        <Route name="profile" handler={ProfileApp}/>

        <Route name="users" handler={UsersApp}/>
        <Route name="leagues" handler={LeaguesApp}/>
        <Route name="countries" handler={CountriesApp}/>
        <Route name="tournaments" handler={TournamentsApp}/>
        <Route name="categories" handler={CategoriesApp}/>
        <Route name="news" handler={NewsApp}/>
        <Route name="games" handler={GamesApp}/>
        <Route name="contacts" handler={ContactsApp}/>
        <Route name="fields" handler={FieldsApp}/>
        <Route name="orders" handler={OrdersApp}/>

        <DefaultRoute handler={UsersApp}/>
    </Route>
);


module.exports = Routes;
