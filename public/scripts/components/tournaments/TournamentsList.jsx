"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    TournamentItem       = require('../tournaments/TournamentItem.jsx'),

    TournamentsActions   = require('../../actions/TournamentsActions');

var TournamentsList = React.createClass({

    propTypes: function () {
        return {
            tournaments: React.PropTypes.array
        }
    },

    getDefaultProps: function () {
        return {
            tournaments: []
        }
    },

    getInitialState: function () {
        return {
            tournaments: this.props.tournaments
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.state.tournaments.length != nextProps.tournaments.length) {
            this.setState({tournaments: nextProps.tournaments});
        }
    },

    _onDrop: function (from, to) {
        var items = this.state.tournaments.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        this.setState({tournaments: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            TournamentsActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true})
        })
    },

    render: function () {
        if (!this.state.tournaments.length) {
            return false;
        }

        var items = this.state.tournaments.map(function (item, i) {
            return (
                <TournamentItem tournament={item} onEdit={this.props.onEdit} onDrop={this._onDrop} index={i} key={item._id} />
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>

        );
    }
});

module.exports = TournamentsList;
