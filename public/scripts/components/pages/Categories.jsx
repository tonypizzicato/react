"use strict";

var React             = require('react'),
    Router            = require('react-router'),
    mui               = require('material-ui'),

    CategoriesActions = require('../../actions/CategoriesActions'),
    CategoriesStore   = require('../../stores/CategoriesStore'),

    CategoryForm      = require('../categories/CategoryForm.jsx'),
    CategoriesList    = require('../categories/CategoriesList.jsx');

var CategoriesApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            categories:       [],
            selectedCategory: {}
        }
    },

    componentDidMount: function () {
        CategoriesStore.addChangeListener(this._onChange);
        CategoriesActions.load();
    },

    componentWillUnmount: function () {
        CategoriesStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState({
            categories:       CategoriesStore.getAll(),
            selectedCategory: this.getInitialState().selectedCategory
        });
    },

    _onDelete: function (e) {
        CategoriesActions.delete(e.currentTarget.dataset.id);
    },

    _onEdit: function (e) {
        this.setState({
            selectedCategory: this.state.categories.filter(function (category) {
                return category._id == e.currentTarget.dataset.id;
            }).pop()
        });
    },

    _onCancel: function () {
        this.setState({
            selectedCategory: this.getInitialState().selectedCategory
        });
    },

    render: function () {
        return (
            <div>
                <CategoryForm category={this.state.selectedCategory} onCancel={this._onCancel} key={'category-form'}/>
                <CategoriesList categories={this.state.categories} onDelete={this._onDelete} onEdit={this._onEdit}/>
            </div>
        )
    }
});

module.exports = CategoriesApp;
