"use strict";

var _                 = require('lodash'),
    React             = require('react'),
    mui               = require('material-ui'),

    Paper             = mui.Paper,
    TextField         = mui.TextField,
    Button            = mui.RaisedButton,

    EventsConstants   = require('../../constants/EventsConstants'),

    CategoriesActions = require('../../actions/CategoriesActions'),
    CategoriesStore   = require('../../stores/CategoriesStore');

var CategoryForm = React.createClass({

    propTypes: function () {
        return {
            category: React.PropTypes.object,
            onCancel: React.PropTypes.func
        }
    },

    getDefaultProps: function () {
        return {
            category: {
                name: ''
            },
            leagueId: ''
        }
    },

    getInitialState: function () {
        return {
            validation: {}
        }
    },

    componentWillMount: function () {
        CategoriesStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillUnmount: function () {
        CategoriesStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!nextProps.category.hasOwnProperty('_id') && this.refs.form) {
            this._clearForm();
        }
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    _onSave: function () {
        var category = {
            name: this.refs.name.getValue()
        };

        this.setState({validation: {}});
        if (this.props.category._id) {
            category._id = this.props.category._id;
            CategoriesActions.save(category);
        } else {
            CategoriesActions.add(category);
        }
    },

    _onCancel: function () {
        this.setState({validation: this.getInitialState().validation});

        this._clearForm();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    _clearForm: function () {
        this.refs.name.setValue('');
    },

    render: function () {

        return (
            <div className="panel panel_type_category-create s_pt_0" key={this.props.category._id ? this.props.category._id : 'category-form'} ref="form">
                <TextField
                    defaultValue={this.props.category.name}
                    hintText="Введите имя категории"
                    floatingLabelText="Категория"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name"/>

                <div className="s_position_relative s_overflow_hidden s_mt_24">
                    <div className="buttons s_float_r s_width_third">
                        <Button className="button_type_cancel" label="Отменить" secondary={true} onClick={this._onCancel}/>
                        <Button className="button_type_save s_float_r" label="Сохранить" primary={true} onClick={this._onSave}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CategoryForm;
