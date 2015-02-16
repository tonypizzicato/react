"use strict";

var $                = require('jquery'),
    React            = require('react'),
    Router           = require('react-router'),
    mui              = require('material-ui'),

    Tabs             = mui.Tabs,
    Tab              = mui.Tab,
    DropDownMenu     = mui.DropDownMenu,

    EventsConstants  = require('../../constants/EventsConstants'),
    LeaguesActions   = require('../../actions/LeaguesActions'),
    LeaguesStore     = require('../../stores/LeaguesStore'),
    CountriesActions = require('../../actions/CountriesActions'),
    CountriesStore   = require('../../stores/CountriesStore'),

    CountryNew       = require('../countries/CountryNew.jsx'),
    CountriesItem    = require('../countries/CountriesItem.jsx');

var _calls = [],
    _deferred;

var CountriesApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            leagues:         [],
            countries:       [],
            selectedCountry: {}
        }
    },

    componentDidMount: function () {
        _calls = [];
        _deferred = new $.Deferred();

        LeaguesStore.addChangeListener(this._onChange);
        CountriesStore.addChangeListener(this._onChange);

        LeaguesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);
        CountriesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);

        // Load entities
        LeaguesActions.load();
        CountriesActions.load();
    },

    componentWillUnmount: function () {
        LeaguesStore.removeChangeListener(this._onChange);
        CountriesStore.removeChangeListener(this._onChange);

        LeaguesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
        CountriesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
    },

    _onCall: function (call) {
        _calls.push(call);

        if (_calls.length == 2) {
            $.when(_calls[0], _calls[1]).done(function () {
                _deferred.resolve();
            }.bind(this));
        }
    },

    _onChange: function () {
        _deferred.then(function () {
            this.setState({
                leagues:         LeaguesStore.getAll(),
                countries:       CountriesStore.getAll(),
                selectedCountry: this.getInitialState().selectedCountry
            });
        }.bind(this));
    },

    _onDelete: function (e) {
        CountriesActions.delete(e.currentTarget.dataset.id);
    },

    _onEdit: function (e) {
        this.setState({
            selectedCountry: this.state.countries.filter(function (country) {
                return country._id == e.currentTarget.dataset.id;
            }).pop()
        });
    },

    render: function () {
        var tabItems = this.state.leagues.map(function (league) {
            var countriesItems = this.state.countries.filter(function (country) {
                return country.leagueId == league._id
            }).map(function (country) {
                return (
                    <CountriesItem country={country} onDelete={this._onDelete} onEdit={this._onEdit} key={country._id} />
                );
            }.bind(this));

            var key = league._id + '_' + (this.state.selectedCountry._id ? this.state.selectedCountry._id : Math.random()).toString();

            return (
                <Tab label={league.name} key={league._id} >
                    <CountryNew country={this.state.selectedCountry} leagueId={league._id} key={key} />
                    {countriesItems}
                </Tab>
            );
        }.bind(this));
        return (
            <Tabs>{tabItems}</Tabs>
        );
    }
});

module.exports = CountriesApp;
