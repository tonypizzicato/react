"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    CategoryItem         = require('../categories/CategoryItem.jsx'),

    CategoriesActions    = require('../../actions/CategoriesActions');

var CategoriesList = React.createClass({

    propTypes: function () {
        return {
            categories: React.PropTypes.array,
            onEdit:     React.PropTypes.func.required,
            onDelete:   React.PropTypes.func.required
        }
    },

    getDefaultProps: function () {
        return {
            categories: []
        }
    },

    getInitialState: function () {
        return {
            categories: this.props.categories
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.state.categories.length != nextProps.categories.length) {
            this.setState({categories: nextProps.categories});
        }
    },

    _onDrop: function (from, to) {
        var items = this.state.categories.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        this.setState({categories: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            CategoriesActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true});
        })
    },

    render: function () {
        if (!this.state.categories.length) {
            return false;
        }

        var items = this.state.categories.map(function (item, i) {
            return (
                <CategoryItem category={item} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onDrop={this._onDrop} index={i} key={item._id}/>
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>
        );
    }
});

module.exports = CategoriesList;
