"use strict";

var React       = require('react'),
    Router      = require('react-router'),
    mui         = require('material-ui'),

    NewsStore   = require('../../stores/NewsStore'),
    NewsActions = require('../../actions/NewsActions'),

    NewsNew     = require('../NewsNew.jsx'),
    NewsItem    = require('../NewsItem.jsx');


var NewsApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            news: []
        };
    },

    componentDidMount: function () {
        NewsStore.addChangeListener(this._onChange);
        NewsActions.load();
    },

    componentWillUnmount: function () {
        NewsStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState({news: NewsStore.getAll()});
    },

    render: function () {
        var news = this.state.news
            .sort(function (a, b) {
                return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0;
            })
            .map(function (item) {
                return <NewsItem article={item} key={item.id} />
            });
        return (
            <div>
                <h3>Hello form News App!</h3>
                <h3>Last News</h3>
                <div className="s_mb_24">
                    <NewsNew />
                </div>
                <div>
                    {news}
                </div>
            </div>
        )
    }
});

module.exports = NewsApp;