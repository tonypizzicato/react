const _                  = require('lodash'),
      React              = require('react'),
      mui                = require('material-ui'),

      Spacing            = mui.Styles.Spacing,

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

class ContactForm extends React.Component {

    static propTypes = {
        contact:  React.PropTypes.object,
        leagueId: React.PropTypes.string.isRequired
    };

    static defaultProps = {
        contact:  {
            name:        '',
            title:       '',
            phone:       '',
            email:       '',
            image:       '',
            toCall:      false,
            vk:          {
                name: '',
                url:  ''
            },
            show:        false,
            tournaments: []
        },
        leagueId: ''
    };

    state = {
        validation:  {},
        tournaments: []
    };

    constructor(props) {
        super(props);

        this._onSave            = this._onSave.bind(this);
        this._onCancel          = this._onCancel.bind(this);
        this._onValidationError = this._onValidationError.bind(this);

        this._onTournaments = this._onTournaments.bind(this);
    }

    componentWillMount() {
        ContactsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
        TournamentsStore.addChangeListener(this._onTournaments);

        TournamentsActions.load();
    }

    componentWillUnmount() {
        ContactsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
        TournamentsStore.removeChangeListener(this._onTournaments);
    }

    //componentDidUpdate() {
    //    if (!!this.props.contact.tournaments) {
    //        this.props.contact.tournaments.forEach(item => {
    //            !!this.refs[`checkbox-${item._id}`] && this.refs[`checkbox-${item._id}`].setChecked(true);
    //        });
    //    }
    //}
    //
    //componentWillReceiveProps(nextProps) {
    //    if (!nextProps.contact.hasOwnProperty('_id') && this.refs.form) {
    //        this._clearForm();
    //    }
    //}

    _onTournaments() {
        const tournaments = TournamentsStore.getByLeague(this.props.leagueId).filter(function (item) {
            return !!item.country;
        });

        this.setState({
            tournaments: tournaments
        });
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onSave() {
        let tournaments = [];

        this.state.tournaments.forEach(item => {
            if (this.refs[`checkbox-${item._id}`].isChecked()) {
                tournaments.push(item._id);
            }
        });

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

        this.setState({validation: {}});

        if (this.props.contact._id) {
            contact._id = this.props.contact._id;
            ContactsActions.save(contact);
        } else {
            ContactsActions.add(contact);
        }
    }

    _onCancel() {
        this._clearForm();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    _clearForm() {
        this.setState({validation: {}});

        this.refs.name.setValue('');
        this.refs.title.setValue('');
        this.refs.phone.setValue('');
        this.refs.email.setValue('');
        this.refs.vk_url.setValue('');
        this.refs.vk_name.setValue('');
        this.refs.show.setToggled(false);
        this.refs.toCall.setToggled(false);
        this.refs.image.setImage(null);

        this.state.tournaments.forEach(item => {
            this.refs['checkbox-' + item._id].setChecked(false);
        });
    }

    render() {
        const styles = this.getStyles();

        if (!this.props.leagueId || !this.state.tournaments.length) {
            return (<h4>Required data is loading or not available</h4>);
        }

        const tournaments = _.groupBy(this.state.tournaments, item => item.country ? item.country.name : 'Остальные');

        const tournamentsBlock = _.mapValues(tournaments, (tournaments, country) => {
            return (
                <div className="s_display_inline-block s_mr_24 s_mb_24">
                    <h5>{country}</h5>
                    <div>
                        {tournaments.map(item => {
                            const index = this.props.contact.tournaments ? this.props.contact.tournaments.indexOf(item._id) : -1;

                            return <Checkbox
                                label={item.name}
                                className={item.show ? '' : 'text_color_muted'}
                                defaultChecked={index !== -1}
                                ref={'checkbox-' + item._id}
                                key={item._id}/>
                            })}
                    </div>
                </div>);

        });

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

module.exports = ContactForm;
