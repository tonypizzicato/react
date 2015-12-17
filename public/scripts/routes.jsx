import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

const MainApp        = require('./components/pages/main.jsx'),
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

export default (
    <Route path="/" component={MainApp}>
        <IndexRoute component={UsersApp}/>

        <Route path="signup" component={Auth.SignUp}/>
        <Route path="login" component={Auth.Login}/>
        <Route path="logout" component={Auth.Logout}/>
        <Route path="profile" component={ProfileApp}/>

        <Route path="users" component={UsersApp}/>
        <Route path="leagues" component={LeaguesApp}/>
        <Route path="countries" component={CountriesApp}/>
        <Route path="tournaments" component={TournamentsApp}/>
        <Route path="categories" component={CategoriesApp}/>
        <Route path="news" component={NewsApp}/>
        <Route path="games" component={GamesApp}/>
        <Route path="contacts" component={ContactsApp}/>
        <Route path="fields" component={FieldsApp}/>
        <Route path="orders" component={OrdersApp}/>
    </Route>
);