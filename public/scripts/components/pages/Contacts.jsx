"use strict";

var $               = require('jquery'),
    React           = require('react'),
    Router          = require('react-router'),
    mui             = require('material-ui'),

    Tabs            = mui.Tabs,
    Tab             = mui.Tab,
    DropDownMenu    = mui.DropDownMenu,

    EventsConstants = require('../../constants/EventsConstants'),

    ContactsActions = require('../../actions/ContactsActions'),
    ContactsStore   = require('../../stores/ContactsStore'),

    ContactForm     = require('../contacts/ContactForm.jsx'),
    ContactsList    = require('../contacts/ContactsList.jsx');

var ContactsApp = React.createClass({

    mixins: [Router.State],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required
        }
    },

    getInitialState: function () {
        return {
            contacts:        [],
            selectedContact: {}
        }
    },

    componentDidMount: function () {
        ContactsStore.addChangeListener(this._onChange);

        if (this.props.leagues.length > 0) {
            ContactsActions.load();
        }
    },

    componentWillUnmount: function () {
        ContactsStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.props.leagues.length != nextProps.leagues.length) {
            ContactsActions.load();
        }
    },

    _onTabChange: function () {
        this.setState({
            selectedContact: this.getInitialState().selectedContact
        });
    },

    _onChange: function () {
        this.setState({
            contacts:        ContactsStore.getAll(),
            selectedContact: this.getInitialState().selectedContact
        });
    },

    _onDelete: function (e) {
        ContactsActions.delete(e.currentTarget.dataset.id);
    },

    _onEdit: function (e) {
        this.setState({
            selectedContact: this.state.contacts.filter(function (contact) {
                return contact._id == e.currentTarget.dataset.id;
            }).pop()
        });
    },

    _onCancel: function () {
        this.setState({
            selectedContact: this.getInitialState().selectedContact
        });
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {
            var contactsItems = this.state.contacts.filter(function (item) {
                return item.leagueId == league._id;
            }.bind(this));

            return (
                <Tab label={league.name} key={league._id} >
                    <ContactForm contact={this.state.selectedContact} leagueId={league._id} onCancel={this._onCancel} key={'contact-form-' + league._id} />
                    <ContactsList contacts={contactsItems} onDelete={this._onDelete} onEdit={this._onEdit} />
                </Tab>
            );
        }.bind(this));
        return (
            <Tabs onChange={this._onTabChange}>{tabItems}</Tabs>
        );
    }
});

module.exports = ContactsApp;
