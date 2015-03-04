"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,
    Router               = require('react-router'),
    mui                  = require('material-ui'),

    Tabs                 = mui.Tabs,
    Tab                  = mui.Tab,

    NewsStore            = require('../../stores/NewsStore'),
    NewsActions          = require('../../actions/NewsActions'),

    CountriesStore       = require('../../stores/CountriesStore'),
    CountriesActions     = require('../../actions/CountriesActions'),

    NewsForm             = require('../news/NewsForm.jsx'),
    NewsList             = require('../news/NewsList.jsx');


var NewsApp = React.createClass({

    mixins: [Router.State],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required
        }
    },

    getInitialState: function () {
        return {
            news:            [],
            countries:       [],
            selectedArticle: {}
        };
    },

    componentDidMount: function () {
        NewsStore.addChangeListener(this._onChange);
        CountriesStore.addChangeListener(this._onChange);
        NewsActions.load();
        CountriesActions.load();
    },

    componentWillUnmount: function () {
        NewsStore.removeChangeListener(this._onChange);
        CountriesStore.removeChangeListener(this._onChange);
    },

    _onTabChange: function () {
        this.setState({
            selectedArticle: this.getInitialState().selectedArticle
        });
    },

    _onChange: function () {
        this.setState({
            news:            NewsStore.getAll(),
            countries:       CountriesStore.getAll(),
            selectedArticle: this.getInitialState().selectedArticle
        });
    },

    _onDelete: function (e) {
        NewsActions.delete(e.currentTarget.dataset.id);
    },

    _onEdit: function (e) {
        this.setState({
            selectedArticle: this.state.news.filter(function (article) {
                return article._id == e.currentTarget.dataset.id;
            }).pop()
        });
    },

    _onCancel: function () {
        this.setState({
            selectedArticle: this.getInitialState().selectedArticle
        });
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {

            if (!this.state.countries.length) {
                return (
                    <Tab label={league.name} key={league._id} >
                        <span className="loading">Loading data</span>
                    </Tab>
                );
            }

            var newsItems = this.state.news.filter(function (article) {
                return article.leagueId == league._id
            }.bind(this));

            var countries = this.state.countries.filter(function (country) {
                return country.leagueId == league._id;
            });

            var key = league._id + '_' + (this.state.selectedArticle._id ? this.state.selectedArticle._id : 'article-new').toString();

            return (
                <Tab label={league.name} key={league._id} >
                    <NewsForm
                        className="s_mb_24"
                        article={this.state.selectedArticle}
                        leagueId={league._id}
                        countries={countries}
                        onCancel={this._onCancel}
                        key={key} />
                    <NewsList news={newsItems} onDelete={this._onDelete} onEdit={this._onEdit} />
                </Tab>
            );
        }.bind(this));
        return (
            <Tabs onChange={this._onTabChange}>{tabItems}</Tabs>
        );
    }
});

module.exports = NewsApp;
