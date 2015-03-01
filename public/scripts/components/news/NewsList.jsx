"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    NewsItem             = require('../news/NewsItem.jsx');

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

    render: function () {
        if (!this.state.news.length) {
            return false;
        }

        var items = this.state.news.map(function (item, i) {
            return (
                <NewsItem article={item} onEdit={this.props.onEdit} onDelete={this.props.onDelete} index={i} key={item._id} />
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