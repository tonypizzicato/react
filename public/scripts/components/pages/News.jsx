import _ from 'lodash';
import scrollTop from '../../utils/scrollTop';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import NewsForm from '../news/NewsForm.jsx';
import NewsList from '../news/NewsList.jsx';

import CategoriesActions from '../../actions/CategoriesActions';
import CountriesActions from '../../actions/CountriesActions';
import NewsActions from '../../actions/NewsActions';

class NewsApp extends React.Component {

    static propTypes = {
        leagues:    React.PropTypes.object.isRequired,
        categories: React.PropTypes.object.isRequired,
        countries:  React.PropTypes.object.isRequired,
        news:       React.PropTypes.object.isRequired
    };

    state = {
        activeTab:       0,
        selectedArticle: {},
        addMode:         true
    };

    constructor(props) {
        super(props);

        this._onSubmit    = this._onSubmit.bind(this);
        this._onCancel    = this._onCancel.bind(this);
        this._onDelete    = this._onDelete.bind(this);
        this._onEdit      = this._onEdit.bind(this);
        this._onTabChange = this._onTabChange.bind(this);
    }

    componentDidMount() {
        _.delay(() => {
            this.props.dispatch(CategoriesActions.fetch());
            this.props.dispatch(CountriesActions.fetch());
            this.props.dispatch(NewsActions.fetch());
        }, 100);
    }

    shouldComponentUpdate(nextProps) {
        return !nextProps.fetchesCount;
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:       tab.props.tabIndex,
            selectedArticle: {},
            addMode:         true
        });
    }

    _onDelete(e) {
        const id = e.currentTarget.dataset.id;

        this.props.dispatch(NewsActions.remove(id))
            .then(() => this.props.dispatch(NewsActions.fetch()));
    }

    _onEdit(id) {
        this.setState({
            selectedArticle: this.props.news.toJS().filter(function (article) {
                return article._id == id;
            }).pop(),
            addMode:         false
        });

        scrollTop();
    }

    _onSubmit(article) {
        const actionName = this.state.addMode ? 'add' : 'save';

        this.props.dispatch(NewsActions[actionName](article))
            .then(() => this.props.dispatch(NewsActions.fetch()))
            .then(this._onCancel);
    }

    _onCancel() {
        this.setState({
            selectedArticle: {},
            addMode:         true
        });
    }

    render() {
        return (
            <Tabs>
                {this.props.leagues.toJS().map((league, index) => {
                    const newsItems = this.props.news.toJS().filter(article => article.leagueId == league._id);
                    const countries = this.props.countries.toJS().filter(country => country.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        const article = this.state.selectedArticle;
                        const key     = `${article._id ? article._id : _.uniqueId()}-form`;

                        tabContent = (
                            <div>
                                <NewsForm
                                    article={article}
                                    leagueId={league._id}
                                    categories={this.props.categories.toJS()}
                                    countries={countries}
                                    onSubmit={this._onSubmit}
                                    onCancel={this._onCancel}
                                    key={key}/>

                                <NewsList
                                    news={newsItems}
                                    onEdit={this._onEdit}
                                    onSubmit={this._onSubmit}
                                    onDelete={this._onDelete}/>
                            </div>
                        )
                    }

                    return (
                        <Tab label={league.name} onActive={this._onTabChange} key={league._id}>
                            {tabContent}
                        </Tab>
                    );
                })}
            </Tabs>
        );
    }
}

function mapState(state) {
    return {
        leagues:      state.getIn(['leagues', 'items']),
        categories:   state.getIn(['categories', 'items']),
        countries:    state.getIn(['countries', 'items']),
        news:         state.getIn(['news', 'items']),
        fetchesCount: state.get('fetchesCount')
    }
};

export default connect(mapState)(NewsApp);
