import _ from 'lodash';
import React, { Component, PropTypes} from 'react';

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Button from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Spacing from 'material-ui/styles/spacing';

import ImageUpload from '../ImageUpload.jsx';

class ContactForm extends Component {

    static propTypes = {
        leagueId:    PropTypes.string.isRequired,
        onCancel:    PropTypes.func.isRequired,
        onSubmit:    PropTypes.func.isRequired,
        tournaments: PropTypes.array.isRequired,
        contact:     PropTypes.object,
    };

    state = {
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onSave            = this._onSave.bind(this);
        this._onCancel          = this._onCancel.bind(this);
        this._onValidationError = this._onValidationError.bind(this);
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onSave() {
        this.setState({validation: {}});

        const tournaments = this.props.tournaments
            .filter(item => this.refs[`checkbox-${item._id}`])
            .filter(item => this.refs[`checkbox-${item._id}`].isChecked())
            .map(item => item._id);

        let contact = {
            name:        this.refs.name.getValue(),
            title:       this.refs.title.getValue(),
            phone:       this.refs.phone.getValue(),
            email:       this.refs.email.getValue(),
            show:        this.refs.show.isToggled(),
            toCall:      this.refs.toCall.isToggled(),
            vk:          {
                name: this.refs.vk_name.getValue(),
                url:  this.refs.vk_url.getValue()
            },
            image:       this.refs.image.getImage(),
            tournaments: tournaments,
            leagueId:    this.props.leagueId
        };

        if (this.props.contact._id) {
            Object.assign(contact, {_id: this.props.contact._id});
        }

        this.props.onSubmit(contact);
    }

    _onCancel() {
        this.setState({validation: {}});

        this.props.onCancel();
    }

    render() {
        const styles = this.getStyles();

        const tournaments = _.groupBy(this.props.tournaments, item => item.country ? item.country.name : 'Остальные');

        const tournamentsBlock = (
            <div>{
                _.values(_.mapValues(tournaments, (tournaments, country) => {
                    const tournamentsEl = tournaments.map(item => {
                        if (!item.show) return;

                        const checked = _.indexOf(this.props.contact.tournaments, item._id) > -1;

                        return <Checkbox
                            label={item.name}
                            defaultChecked={checked}
                            ref={`checkbox-${item._id}`}
                            key={`checkbox-${item._id}`}/>
                    });

                    return (
                        <div className="s_display_inline-block s_mr_24 s_mb_24" key={country}>
                            <h5>{country}</h5>
                            {tournamentsEl}
                        </div>);

                }))}
            </div>
        )

        return (
            <div style={styles.root} key={`${this.props.contact._id}-contact-form`} ref="form">
                <TextField
                    style={styles.input}
                    defaultValue={this.props.contact.name}
                    hintText="Введите имя"
                    floatingLabelText="Имя"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.contact.title}
                    hintText="Введите должность"
                    floatingLabelText="Должность"
                    errorText={this.state.validation.title ? 'Поле не может быть пустым' : null}
                    ref="title"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.contact.email}
                    floatingLabelText="Email"
                    hintText="contacts.email@amateurs.io"
                    type="email"
                    errorText={this.state.validation.email ? 'Поле не может быть пустым' : null}
                    ref="email"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.contact.phone}
                    floatingLabelText="Телефон"
                    hintText="+7 (999) 999 99 99"
                    type="phone"
                    errorText={this.state.validation.phone ? 'Поле не может быть пустым' : null}
                    ref="phone"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.contact.vk ? this.props.contact.vk.url : ''}
                    hintText="https://vk.com/id111111"
                    floatingLabelText="Вкотнакте URL"
                    errorText={this.state.validation.vk ? 'Поле не может быть пустым' : null}
                    ref="vk_url"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.contact.vk ? this.props.contact.vk.name : ''}
                    hintText="Имя Прозвище Фамилия"
                    floatingLabelText="Имя Вконтакте"
                    errorText={this.state.validation.vk ? 'Поле не может быть пустым' : null}
                    ref="vk_name"/>

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
                    ref="image"/>

                <Toggle
                    style={styles.toggle}
                    name="show"
                    value="show"
                    labelPosition="right"
                    ref="show"
                    defaultToggled={this.props.contact.show}
                    label="Показывать"/>
                <Toggle
                    style={styles.toggle}
                    name="toCall"
                    value="toCall"
                    labelPosition="right"
                    ref="toCall"
                    defaultToggled={this.props.contact.toCall}
                    label="Для связи"/>

                <Button style={styles.button} label="Отменить" secondary={true} onClick={this._onCancel}/>
                <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSave}/>
            </div>
        );
    }

    getStyles() {
        return {
            root:   {
                marginBottom: Spacing.desktopGutter,
                padding:      `0 ${Spacing.desktopGutter}px`
            },
            input:  {
                width: '100%'
            },
            toggle: {
                height:       Spacing.desktopGutter,
                marginTop:    Spacing.desktopGutter,
                marginBottom: Spacing.desktopGutter,
                marginRight:  Spacing.desktopGutter
            },
            button: {
                marginRight: Spacing.desktopGutter
            }
        }
    }
}

export default ContactForm;
