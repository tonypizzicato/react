"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    NewsItem             = require('../news/NewsItem.jsx'),

    NewsActions          = require('../../actions/NewsActions');

var NewsList = React.createClass({

    propTypes: function () {
        return {
            news:   React.PropTypes.array,
            onEdit: React.PropTypes.func.required
        }
    },

    getDefaultProps: function () {
        return {
            news: []
        }
    },

    getInitialState: function () {
        return {
            news: this.props.news
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.state.news.length != nextProps.news.length) {
            this.setState({news: nextProps.news});
        }
    },

    _onDrop: function (from, to) {
        var items = this.state.news.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        this.setState({news: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            NewsActions.save({
                _id:      item._id,
                sort:     index
            }, {silent: true});
        }.bind(this))
    },

    render: function () {
        if (!this.state.news.length) {
            return false;
        }

        var items = this.state.news.map(function (item, i) {
            return (
                <NewsItem article={item} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onDrop={this._onDrop} index={i} key={item._id} />
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>
        );
    }
});

module.exports = NewsList;
