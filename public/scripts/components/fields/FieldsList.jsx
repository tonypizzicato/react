"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    FieldItem            = require('../fields/FieldItem.jsx'),

    FieldsActions        = require('../../actions/FieldsActions');

var FieldsList = React.createClass({

    propTypes: function () {
        return {
            fields:   React.PropTypes.array,
            onEdit:   React.PropTypes.func.required,
            onDelete: React.PropTypes.func.required
        }
    },

    getDefaultProps: function () {
        return {
            fields: []
        }
    },

    getInitialState: function () {
        return {
            fields: this.props.fields
        }
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({fields: nextProps.fields});
    },

    _onDrop: function (from, to) {
        var items = this.state.fields.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        this.setState({fields: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            FieldsActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true});
        })
    },

    render: function () {
        if (!this.state.fields.length) {
            return false;
        }

        var items = this.state.fields.map(function (item, i) {
            return (
                <FieldItem field={item} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onDrop={this._onDrop} index={i} key={item._id}/>
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>
        );
    }
});

module.exports = FieldsList;
