"use strict";

var _                  = require('lodash'),
    React              = require('react'),
    mui                = require('material-ui'),

    Paper              = mui.Paper,
    TextField          = mui.TextField,
    Toggle             = mui.Toggle,
    Button             = mui.RaisedButton,
    Checkbox           = mui.Checkbox,

    ImageUpload        = require('../ImageUpload.jsx'),

    EventsConstants    = require('../../constants/EventsConstants'),

    ContactsActions    = require('../../actions/ContactsActions'),
    ContactsStore      = require('../../stores/ContactsStore'),

    TournamentsActions = require('../../actions/TournamentsActions'),
    TournamentsStore   = require('../../stores/TournamentsStore');

var ContactForm = React.createClass({

    propTypes: function () {
        return {
            contact:  React.PropTypes.object,
            leagueId: React.PropTypes.string.required
        }
    },

    getDefaultProps: function () {
        return {
            contact:  {
                name:        '',
                title:       '',
                phone:       '',
                email:       '',
                image:       '',
                vk:          {
                    name: '',
                    url:  ''
                },
                show:        false,
                tournaments: []
            },
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
        ContactsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
        TournamentsStore.addChangeListener(this._onTournaments);

        TournamentsActions.load();
    },

    componentWillUnmount: function () {
        ContactsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
        TournamentsStore.removeChangeListener(this._onTournaments);
    },

    componentDidUpdate: function () {
        if (!!this.props.contact.tournaments) {
            this.props.contact.tournaments.forEach(function (item) {
                this.refs['checkbox-' + item].setChecked(true);
            }.bind(this));
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (!nextProps.contact.hasOwnProperty('_id') && this.refs.form) {
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
        var contact = {
            name:        this.refs.name.getValue(),
            title:       this.refs.title.getValue(),
            phone:       this.refs.phone.getValue(),
            email:       this.refs.email.getValue(),
            show:        this.refs.show.isToggled(),
            vk:          {
                name: this.refs.vk_name.getValue(),
                url:  this.refs.vk_url.getValue()
            },
            image:       this.refs.image.getImage(),
            tournaments: tournaments,
            leagueId:    this.props.leagueId
        };

        this.setState({validation: {}});
        if (this.props.contact._id) {
            contact._id = this.props.contact._id;
            ContactsActions.save(contact);
        } else {
            ContactsActions.add(contact);
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
        this.refs.title.setValue('');
        this.refs.phone.setValue('');
        this.refs.email.setValue('');
        this.refs.vk_url.setValue('');
        this.refs.vk_name.setValue('');
        this.refs.show.setToggled(false);
        this.refs.image.setImage(null);

        this.state.tournaments.forEach(function (item) {
            this.refs['checkbox-' + item._id].setChecked(false);
        }.bind(this));
    },

    render: function () {
        if (!this.props.leagueId || !this.state.tournaments.length) {
            return (<h4>Required data is loading or not available</h4>);
        }
        var tournaments = _.groupBy(this.state.tournaments, function (item) {
            return item.country ? item.country.name : 'Остальные';
        });

        var tournamentsBlock = _.mapObject(tournaments, function (tournaments, country) {
            var tournamentsEl = tournaments.map(function (item) {
                var index = this.props.contact.tournaments ? this.props.contact.tournaments.indexOf(item._id) : false;
                return <Checkbox
                    label={item.name}
                    className={item.show ? '' : 'text_color_muted'}
                    defaultChecked={index !== false}
                    ref={'checkbox-' + item._id}
                    key={'checkbox-' + item._id + '-' + item._id}/>
            }.bind(this));

            return (
                <div className="s_display_inline-block s_mr_24 s_mb_24">
                    <h5>{country}</h5>
                    {tournamentsEl}
                </div>);

        }.bind(this));

        return (
            <div className="panel panel_type_contact-create s_pt_0" key={this.props.contact._id ? this.props.contact._id : 'contact-form'} ref="form">
                <TextField
                    defaultValue={this.props.contact.name}
                    hintText="Введите имя"
                    floatingLabelText="Имя"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name" />

                <TextField
                    defaultValue={this.props.contact.title}
                    hintText="Введите должность"
                    floatingLabelText="Должность"
                    errorText={this.state.validation.title ? 'Поле не может быть пустым' : null}
                    ref="title" />

                <TextField
                    defaultValue={this.props.contact.email}
                    floatingLabelText="Email"
                    hintText="contacts.email@amateurs.io"
                    type="email"
                    errorText={this.state.validation.email ? 'Поле не может быть пустым' : null}
                    ref="email" />

                <TextField
                    defaultValue={this.props.contact.phone}
                    floatingLabelText="Телефон"
                    hintText="+7 (999) 999 99 99"
                    type="phone"
                    errorText={this.state.validation.phone ? 'Поле не может быть пустым' : null}
                    ref="phone" />

                <TextField
                    defaultValue={this.props.contact.vk ? this.props.contact.vk.url : ''}
                    hintText="https://vk.com/id111111"
                    floatingLabelText="Вкотнакте URL"
                    errorText={this.state.validation.vk ? 'Поле не может быть пустым' : null}
                    ref="vk_url" />

                <TextField
                    defaultValue={this.props.contact.vk ? this.props.contact.vk.name : ''}
                    hintText="Имя Прозвище Фамилия"
                    floatingLabelText="Имя Вконтакте"
                    errorText={this.state.validation.vk ? 'Поле не может быть пустым' : null}
                    ref="vk_name" />

                <div className="s_mt_24">
                    {tournamentsBlock}
                </div>

                <ImageUpload
                    label="Выберите изображение (Обязательно)"
                    image={this.props.contact.image}
                    width="250px"
                    height="250px"
                    errorText={this.state.validation.image ? 'Загрузите изображение для контакта' : null}
                    key={this.props._id + '-image-upload'}
                    ref="image" />

                <div className="s_position_relative s_overflow_hidden s_mt_24" key="contact-state-radio">
                    <div className="s_float_l s_width_half">
                        <div className="s_width_third s_display_inline-block s_mt_24">
                            <Toggle
                                name="show"
                                value="show"
                                ref="show"
                                defaultToggled={this.props.contact.show}
                                label="Показывать" />
                        </div>
                    </div>

                    <div className="buttons s_float_r s_width_third">
                        <Button className="button_type_cancel s_mt_36" label="Отменить" secondary={true} onClick={this._onCancel} />
                        <Button className="button_type_save s_float_r s_mt_36" label="Сохранить" primary={true} onClick={this._onSave} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ContactForm;
