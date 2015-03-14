"use strict";

var assign          = require('object-assign'),
    React           = require('react'),
    mui             = require('material-ui'),

    Paper           = mui.Paper,
    TextField       = mui.TextField,
    Button          = mui.RaisedButton,

    EventsConstants = require('../../constants/EventsConstants'),

    LeaguesActions  = require('../../actions/LeaguesActions'),
    LeaguesStore    = require('../../stores/LeaguesStore');

var LeagueForm = React.createClass({

    propTypes: function () {
        return {
            league: React.PropTypes.object
        }
    },

    getDefaultProps: function () {
        return {
            league: {
                _id:  null,
                name: '',
                slug: ''
            }
        }
    },

    getInitialState: function () {
        return {
            validation: {}
        }
    },

    componentDidMount: function () {
        LeaguesStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillUnmount: function () {
        LeaguesStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    _onSave: function () {
        var league = {
            _id:  this.props.league._id,
            name: this.refs.name.getValue(),
            slug: this.refs.slug.getValue()
        };

        this.setState({validation: {}});
        LeaguesActions.save(league);
    },

    _onCancel: function () {
        this.setState({validation: this.getInitialState().validation});

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    render: function () {
        var disabled = !this.props.league._id;
        console.log(this.props.league);
        return (
            <div className="panel panel_type_league-create s_pt_0">
                <TextField
                    defaultValue={this.props.league.name}
                    hintText="Введите название турнира"
                    floatingLabelText="Название"
                    disabled={true}
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name" />

                <TextField
                    defaultValue={this.props.league.slug}
                    hintText="Введите url турнира (пример: bpl)"
                    placehoder="URL"
                    floatingLabelText="URL"
                    disabled={disabled}
                    errorText={this.state.validation.slug ? 'Поле не может быть пустым' : null}
                    ref="slug" />

                <div className="s_position_relative s_overflow_hidden s_mt_24">
                    <div className="buttons s_float_r s_width_quarter">
                        <Button className="button_type_cancel s_mt_36" label="Cancel" secondary={true} disabled={!this.props.league.name} onClick={this._onCancel} />
                        <Button className="button_type_save s_float_r s_mt_36" label="Save" primary={true} disabled={!this.props.league.name} onClick={this._onSave} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = LeagueForm;
