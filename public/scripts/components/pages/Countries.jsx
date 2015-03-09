"use strict";

var $                = require('jquery'),
    React            = require('react'),
    Router           = require('react-router'),
    mui              = require('material-ui'),

    Tabs             = mui.Tabs,
    Tab              = mui.Tab,
    DropDownMenu     = mui.DropDownMenu,

    EventsConstants  = require('../../constants/EventsConstants'),
    CountriesActions = require('../../actions/CountriesActions'),
    CountriesStore   = require('../../stores/CountriesStore'),

    CountryNew       = require('../countries/CountryNew.jsx'),
    CountriesList    = require('../countries/CountriesList.jsx');

var _calls = [],
    _deferred;

var CountriesApp = React.createClass({

    mixins: [Router.State],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required
        }
    },

    getInitialState: function () {
        return {
            countries:       [],
            selectedCountry: {}
        }
    },

    componentDidMount: function () {
        _calls = [];
        _deferred = new $.Deferred();

        _deferred.then(function () {
        }.bind(this));

        CountriesStore.addChangeListener(this._onChange);

        // Load entities
        CountriesActions.load();
    },

    componentWillUnmount: function () {
        CountriesStore.removeChangeListener(this._onChange);
    },

    _onTabChange: function() {
        this.setState({
            selectedCountry: this.getInitialState().selectedCountry
        });
    },

    _onChange: function () {
        this.setState({
            countries:       CountriesStore.getAll(),
            selectedCountry: this.getInitialState().selectedCountry
        });
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

    _onCancel: function () {
        this.setState({
            selectedCountry: this.getInitialState().selectedCountry
        });
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {
            var countriesItems = this.state.countries.filter(function (country) {
                return country.leagueId == league._id
            }.bind(this));

            var key = league._id + '_' + (this.state.selectedCountry._id ? this.state.selectedCountry._id : Math.random().toString());

            return (
                <Tab label={league.name} key={league._id} >
                    <CountryNew country={this.state.selectedCountry} leagueId={league._id} onCancel={this._onCancel} key={key} />
                    <CountriesList countries={countriesItems} onDelete={this._onDelete} onEdit={this._onEdit} />
                </Tab>
            );
        }.bind(this));
        return (
            <Tabs onChange={this._onTabChange}>{tabItems}</Tabs>
        );
    }
});

module.exports = CountriesApp;
