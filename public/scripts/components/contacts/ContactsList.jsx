"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    ContactItem          = require('../contacts/ContactItem.jsx'),

    ContactsActions      = require('../../actions/ContactsActions');

var ContactsList = React.createClass({

    propTypes: function () {
        return {
            contacts: React.PropTypes.array,
            onEdit:   React.PropTypes.func.required,
            onDelete: React.PropTypes.func.required
        }
    },

    getDefaultProps: function () {
        return {
            contacts: []
        }
    },

    getInitialState: function () {
        return {
            contacts: this.props.contacts
        }
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({contacts: nextProps.contacts});
    },

    _onDrop: function (from, to) {
        var items = this.state.contacts.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        this.setState({contacts: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            ContactsActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true});
        })
    },

    render: function () {
        if (!this.state.contacts.length) {
            return false;
        }

        var items = this.state.contacts.map(function (item, i) {
            return (
                <ContactItem contact={item} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onDrop={this._onDrop} index={i} key={item._id}/>
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>
        );
    }
});

module.exports = ContactsList;
