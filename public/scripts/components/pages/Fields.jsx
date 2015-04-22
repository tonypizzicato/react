"use strict";

var $               = require('jquery'),
    React           = require('react'),
    Router          = require('react-router'),
    mui             = require('material-ui'),

    Tabs            = mui.Tabs,
    Tab             = mui.Tab,
    DropDownMenu    = mui.DropDownMenu,

    EventsConstants = require('../../constants/EventsConstants'),

    FieldsActions   = require('../../actions/FieldsActions'),
    FieldsStore     = require('../../stores/FieldsStore'),

    FieldsList      = require('../fields/FieldsList.jsx'),
    FieldForm       = require('../fields/FieldForm.jsx');

var FieldsApp = React.createClass({

    mixins: [Router.State],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required
        }
    },

    getInitialState: function () {
        return {
            fields:        [],
            selectedField: {}
        }
    },

    componentDidMount: function () {
        FieldsStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        FieldsStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.leagues.length) {
            FieldsActions.load();
        }
    },

    _onTabChange: function () {
        this.setState({
            selectedField: this.getInitialState().selectedField
        });
    },

    _onChange: function () {
        this.setState({
            fields:        FieldsStore.getAll(),
            selectedField: this.getInitialState().selectedField
        });
    },

    _onDelete: function (e) {
        FieldsActions.delete(e.currentTarget.dataset.id);
    },

    _onEdit: function (e) {
        this.setState({
            selectedField: this.state.fields.filter(function (field) {
                return field._id == e.currentTarget.dataset.id;
            }).pop()
        });
    },

    _onCancel: function () {
        this.setState({
            selectedField: this.getInitialState().selectedField
        });
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {
            var fieldsItems = this.state.fields.filter(function (item) {
                return item.leagueId == league._id;
            }.bind(this));

            return (
                <Tab label={league.name} key={league._id}>
                    <FieldForm field={this.state.selectedField} leagueId={league._id} onCancel={this._onCancel} key={'field-form-' + league._id}/>
                    <FieldsList fields={fieldsItems} onDelete={this._onDelete} onEdit={this._onEdit}/>
                </Tab>
            );
        }.bind(this));
        return (
            <Tabs onChange={this._onTabChange}>{tabItems}</Tabs>
        );
    }
});

module.exports = FieldsApp;
