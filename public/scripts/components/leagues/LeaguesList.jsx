"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    LeagueItem           = require('../leagues/LeagueItem.jsx'),

    LeaguesActions       = require('../../actions/LeaguesActions');

var LeaguesList = React.createClass({

    propTypes: function () {
        return {
            leagues: React.PropTypes.array
        }
    },

    getDefaultProps: function () {
        return {
            leagues: []
        }
    },

    _onDrop: function (from, to) {
        var items = this.props.leagues.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            LeaguesActions.save({
                _id:  item._id,
                sort: index
            });
        })
    },

    render: function () {
        if (!this.props.leagues.length) {
            return false;
        }

        var items = this.props.leagues.map(function (item, i) {
            return (
                <LeagueItem league={item} onEdit={this.props.onEdit} onDrop={this._onDrop} index={i} key={item._id} />
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>

        );
    }
});

module.exports = LeaguesList;
