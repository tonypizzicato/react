"use strict";

var _                  = require('underscore'),
    React              = require('react'),
    mui                = require('material-ui'),

    Paper              = mui.Paper,
    TextField          = mui.TextField,
    Toggle             = mui.Toggle,
    Button             = mui.RaisedButton,
    Checkbox           = mui.Checkbox,

    MediumEditor       = require('../MediumEditor.jsx'),
    ImageUpload        = require('../ImageUpload.jsx'),

    EventsConstants    = require('../../constants/EventsConstants'),

    FieldsActions      = require('../../actions/FieldsActions'),
    FieldsStore        = require('../../stores/FieldsStore'),

    TournamentsActions = require('../../actions/TournamentsActions'),
    TournamentsStore   = require('../../stores/TournamentsStore');

var FieldForm = React.createClass({

    propTypes: function () {
        return {
            field:    React.PropTypes.object,
            leagueId: React.PropTypes.string.required
        }
    },

    getDefaultProps: function () {
        return {
            field:    {},
            leagueId: ''
        }
    },

    getInitialState: function () {
        return {
            validation:  {},
            tournaments: []
        }
    },

    componentWillMount: function () {
        FieldsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
        TournamentsStore.addChangeListener(this._onTournaments);

        TournamentsActions.load();
    },

    componentWillUnmount: function () {
        FieldsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
        TournamentsStore.removeChangeListener(this._onTournaments);
    },

    componentDidUpdate: function () {
        if (!!this.props.field.tournaments) {
            this.props.field.tournaments.forEach(function (item) {
                this.refs['checkbox-' + item].setChecked(true);
            }.bind(this));
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (!nextProps.field.hasOwnProperty('_id') && this.refs.form) {
            this._clearForm();
        }
    },

    _onTournaments: function () {
        this.setState({
            tournaments: TournamentsStore.getByLeague(this.props.leagueId)
        });
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    _onSave: function () {
        var tournaments = [];
        this.state.tournaments.forEach(function (item) {
            if (this.refs['checkbox-' + item._id].isChecked()) {
                tournaments.push(item._id);
            }
        }.bind(this));

        var field = {
            howto:       this.refs.howto.getValue(),
            show:        this.refs.show.isToggled(),
            image:       this.refs.image.getImage(),
            lat:         this.refs.lat.getValue(),
            long:        this.refs.long.getValue(),
            leagueId:    this.props.leagueId,
            tournaments: tournaments
        };

        this.setState({validation: {}});
        if (this.props.field._id) {
            field._id = this.props.field._id;
            FieldsActions.save(field);
        } else {
            FieldsActions.add(field);
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
        this.refs.howto.setValue('');
        this.refs.lat.setValue('');
        this.refs.long.setValue('');
        this.refs.show.setToggled(false);
        this.refs.image.setImage(null);

        this.state.tournaments.forEach(function (item) {
            this.refs['checkbox-' + item._id].setChecked(false);
        }.bind(this));
    },

    render: function () {
        if (!this.props.leagueId || !this.state.tournaments.length) {
            return (<h4>Необходимые данные загружаются</h4>);
        }

        var tournaments = this.state.tournaments.filter(function (item) {
            return !!item.country;
        });

        tournaments = _.groupBy(tournaments, function (item) {
            return item.country ? item.country.name : 'Остальные';
        });

        var tournamentsBlock = _.mapObject(tournaments, function (tournaments, country) {
            var tournamentsEl = tournaments.map(function (item) {
                var index = this.props.field.tournaments ? this.props.field.tournaments.indexOf(item._id) : false;
                return <Checkbox
                    label={item.name}
                    defaultChecked={index !== false}
                    ref={'checkbox-' + item._id}
                    key={'checkbox-' + this.props.field._id + '-' + item._id}/>
            }.bind(this));

            return (
                <div className="s_display_inline-block s_mr_24 s_mb_24">
                    <h5>{country}</h5>
                    {tournamentsEl}
                </div>);

        }.bind(this));

        return (
            <div className="panel panel_type_field-create s_pt_0" key={this.props.field._id ? this.props.field._id : 'field-form'} ref="form">
                <TextField
                    defaultValue={this.props.field.title}
                    floatingLabelText="Название"
                    disabled={true}
                    ref="title"/>

                <TextField
                    defaultValue={this.props.field.address}
                    floatingLabelText="Адрес"
                    disabled={true}
                    ref="address"/>

                <MediumEditor
                    hintText="Как добраться"
                    floatingLabelText="Информация о пути"
                    defaultValue={this.props.field.howto}
                    errorText={this.state.validation.howto ? 'Поле не может быть пустым' : null}
                    ref="howto"/>

                <div className="s_display_inline-block s_width_half">
                    <TextField
                        defaultValue={this.props.field.lat}
                        floatingLabelText="Lat"
                        hintText="56,4554"
                        type="number"
                        disabled={!this.props.field._id}
                        errorText={this.state.validation.lat ? 'Поле не может быть пустым' : null}
                        ref="lat"/>
                </div>

                <div className="s_display_inline-block s_width_half">
                    <TextField
                        defaultValue={this.props.field.long}
                        hintText="56,4554"
                        floatingLabelText="Long"
                        type="number"
                        disabled={!this.props.field._id}
                        errorText={this.state.validation.long ? 'Поле не может быть пустым' : null}
                        ref="long"/>
                </div>

                <div className="s_mt_24">
                    {tournamentsBlock}
                </div>

                <ImageUpload
                    label="Выберите изображение поля"
                    image={this.props.field.image}
                    width="250px"
                    height="250px"
                    errorText={this.state.validation.image ? 'Загрузите изображение для контакта' : null}
                    key={this.props._id + '-image-upload'}
                    ref="image"/>

                <div className="s_position_relative s_overflow_hidden s_mt_24" key="field-state-radio">
                    <div className="s_float_l s_width_half">
                        <div className="s_width_third s_display_inline-block s_mt_24">
                            <Toggle
                                name="show"
                                value="show"
                                ref="show"
                                defaultToggled={this.props.field.show}
                                label="Показывать"/>
                        </div>
                    </div>

                    <div className="buttons s_float_r s_width_third">
                        <Button className="button_type_cancel s_mt_36" label="Отменить" secondary={true} onClick={this._onCancel}/>
                        <Button className="button_type_save s_float_r s_mt_36" label="Сохранить" primary={true} onClick={this._onSave}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = FieldForm;
