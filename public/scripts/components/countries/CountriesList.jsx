"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    CountryItem          = require('../countries/CountryItem.jsx'),

    CountriesActions     = require('../../actions/CountriesActions');

var CountriesList = React.createClass({

    propTypes: function () {
        return {
            countries: React.PropTypes.array
        }
    },

    getDefaultProps: function () {
        return {
            countries: []
        }
    },

    getInitialState: function () {
        return {
            countries: this.props.countries
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.state.countries.length != nextProps.countries.length) {
            this.setState({countries: nextProps.countries});
        }
    },

    _onDrop: function (from, to) {
        var items = this.state.countries.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        this.setState({countries: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            CountriesActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true})
        })
    },

    render: function () {
        if (!this.state.countries.length) {
            return false;
        }

        var items = this.state.countries.map(function (item, i) {
            return (
                <CountryItem country={item} onEdit={this.props.onEdit} onDrop={this._onDrop} index={i} key={item._id} />
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>
        );
    }
});

module.exports = CountriesList;