"use strict";

var React            = require('react'),
    mui              = require('material-ui'),

    Paper            = mui.Paper,
    TextField        = mui.TextField,
    Toggle           = mui.Toggle,
    RadioButtonGroup = mui.RadioButtonGroup,
    RadioButton      = mui.RadioButton,
    Button           = mui.RaisedButton,

    EventsConstants  = require('../../constants/EventsConstants'),

    CountriesActions = require('../../actions/CountriesActions'),
    CountriesStore   = require('../../stores/CountriesStore');

var CountryForm = React.createClass({

    getDefaultProps: function () {
        return {
            country:  {
                name:  '',
                slug:  '',
                state: 'CREATED',
                show:  false
            },
            leagueId: null
        }
    },

    getInitialState: function () {
        return {
            validation: {}
        }
    },

    componentDidMount: function () {
        CountriesStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillUnmount: function () {
        CountriesStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!nextProps.country.hasOwnProperty('_id')) {
            this._clearForm();
        }
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    _onSave: function () {
        var country = {
            name:     this.refs.name.getValue(),
            slug:     this.refs.slug.getValue(),
            state:    this.refs.state.getSelectedValue(),
            leagueId: this.props.leagueId,
            show:     this.refs.show.isToggled()
        };

        this.setState({validation: {}});
        if (this.props.country._id) {
            country._id = this.props.country._id;
            CountriesActions.save(country);
        } else {
            CountriesActions.add(country);
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
        this.refs.slug.setValue('');
        this.refs.state.setSelectedValue('CREATED');
        this.refs.show.setToggled(false);
    },

    render: function () {
        return (
            <div className="panel panel_type_country-create s_pt_0" key={this.props.country._id ? this.props.country._id : 'country-form'}>
                <TextField
                    defaultValue={this.props.country.name}
                    hintText="Введите название страны"
                    floatingLabelText="Название"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name" />

                <TextField
                    defaultValue={this.props.country.slug}
                    hintText="Введите url страны (пример: en)"
                    placehoder="URL"
                    floatingLabelText="URL"
                    errorText={this.state.validation.slug ? 'Поле не может быть пустым' : null}
                    ref="slug" />

                <div className="s_position_relative s_overflow_hidden s_mt_24" key="country-state-radio">
                    <div className="s_float_l s_width_half">
                        <div className="s_float_l s_width_half">
                            <RadioButtonGroup
                                name="state"
                                defaultSelected={this.props.country.state ? this.props.country.state : 'CREATED'}
                                ref="state" >
                                <RadioButton
                                    value="CREATED"
                                    label="CREATED" />
                                <RadioButton
                                    value="ACTIVE"
                                    label="ACTIVE" />
                                <RadioButton
                                    value="ARCHIVE"
                                    label="ARCHIVE" />
                            </RadioButtonGroup>
                        </div>

                        <div className="s_width_quarter s_display_inline-block s_mt_24">
                            <Toggle
                                name="show"
                                value="show"
                                ref="show"
                                defaultToggled={this.props.country.show}
                                label="Show" />
                        </div>
                    </div>

                    <div className="buttons s_float_r s_width_quarter">
                        <Button className="button_type_cancel s_mt_36" label="Cancel" secondary={true} onClick={this._onCancel} />
                        <Button className="button_type_save s_float_r s_mt_36" label="Save" primary={true} onClick={this._onSave} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CountryForm;
