const _               = require('lodash'),
      React           = require('react'),
      mui             = require('material-ui'),

      Spacing         = mui.Styles.Spacing,

      DropDownMenu    = mui.DropDownMenu,
      TextField       = mui.TextField,
      Checkbox        = mui.Checkbox,
      Button          = mui.RaisedButton,
      Avatar          = mui.Avatar,

      ImageUpload     = require('../ImageUpload.jsx'),

      EventsConstants = require('../../constants/EventsConstants'),

      AuthActions     = require('../../actions/AuthActions'),
      AuthStore       = require('../../stores/AuthStore');


const positions = {
    photographer: 'Фотограф',
    videographer: 'Оператор',
    referee:      'Судья',
    lead:         'Руководитель лиги'
};

class ProfileForm extends React.Component {
    static propTypes = {
        leagues: React.PropTypes.array.required,
        user:    React.PropTypes.object.isRequired
    };

    state = {
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onSave            = this._onSave.bind(this);
        this._onChange          = this._onChange.bind(this);
        this._onValidationError = this._onValidationError.bind(this);
    }

    componentWillMount() {
        AuthStore.addChangeListener(this._onChange);
        AuthStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this._onChange);
        AuthStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onChange() {
        this.setState({validation: {}});
    }

    _onSave() {
        let user = {
            _id:       this.props.user._id,
            username:  this.refs.username.getValue(),
            email:     this.refs.email.getValue(),
            phone:     this.refs.phone.getValue(),
            vk:        this.refs.vk.getValue(),
            leagueId:  this.props.leagues[this.refs.league.state.selectedIndex]._id,
            positions: Object.keys(positions).filter(item => this.refs[`position-${item}`].isChecked()),
        };

        let avatar = this.refs.image.getImage();
        if (avatar != '/images/avatar.png') {
            user.avatar = avatar;
        }

        AuthActions.saveUser(user);
    }


    render() {
        const styles = this.getStyles();

        const avatar = this.props.user.avatar ? this.props.user.avatar : '/images/avatar.png';

        let leagueIndex = _.findIndex(this.props.leagues, {_id: this.props.user.leagueId});
        leagueIndex     = leagueIndex > -1 ? leagueIndex : 0;

        return (
            <div>
                <div style={styles.left}>
                    <TextField
                        style={styles.input}
                        defaultValue={this.props.user.username}
                        hintText="Введите имя пользователя"
                        floatingLabelText="Имя пользователя"
                        errorText={this.state.validation.username ? 'Поле не может быть пустым' : null}
                        ref="username"/>

                    <TextField
                        style={styles.input}
                        defaultValue={this.props.user.email}
                        hintText="Введите почту"
                        floatingLabelText="Почта"
                        errorText={this.state.validation.email ? 'Поле не может быть пустым' : null}
                        ref="email"/>

                    <TextField
                        style={styles.input}
                        defaultValue={this.props.user.phone}
                        hintText="Введите номер телефона"
                        floatingLabelText="Номер телефона"
                        ref="phone"/>

                    <TextField
                        style={styles.input}
                        defaultValue={this.props.user.vk}
                        hintText="Введите адрес старницы Вконтакте"
                        floatingLabelText="Старницы Вконтакте"
                        ref="vk"/>

                    <DropDownMenu
                        style={styles.dropdown.root}
                        labelStyle={styles.dropdown.label}
                        underlineStyle={styles.dropdown.underline}
                        menuItems={this.props.leagues.map(item => {
                            return {text: item.name, _id: item._id, name: item.name};
                        })}
                        selectedIndex={leagueIndex}
                        autoWidth={false}
                        ref="league"/>

                    <div style={styles.checkbox.container}>
                        {Object.keys(positions).map(item => {
                            return (
                            <Checkbox
                                style={styles.checkbox.checkbox}
                                name={`position-${item}`}
                                value={item}
                                defaultChecked={this.props.user.positions.indexOf(item) != -1}
                                label={positions[item]}
                                ref={`position-${item}`}/>
                                )
                            })
                            }
                    </div>
                </div>
                <div style={styles.right}>
                    <ImageUpload
                        label="Выберите фото"
                        image={avatar}
                        imageStyle={{borderRadius: '50%'}}
                        deletable={false}
                        width="200px"
                        height="200px"
                        ref="image"/>
                </div>
                <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSave}/>
            </div>
        )
    }

    getStyles() {
        return {
            left:     {
                width:         '70%',
                marginRight:   '5%',
                display:       'inline-block',
                verticalAlign: 'top'
            },
            right:    {
                width:     '25%',
                display:   'inline-block',
                marginTop: Spacing.desktopGutterMore,
                textAlign: 'center'
            },
            input:    {
                width: '100%'
            },
            button:   {
                width: '100%'
            },
            dropdown: {
                root:      {
                    width: '100%'
                },
                label:     {
                    paddingLeft: 0
                },
                underline: {
                    margin: 0
                }
            },
            checkbox: {
                container: {
                    margin:   `${Spacing.desktopGutter}px 0`,
                    overflow: 'hidden',
                    padding:  Spacing.desktopGutterMini
                },
                checkbox:  {
                    display: 'inline-block',
                    width:   '25%'
                }
            },
            avatar:   {
                display: 'block',
                margin:  '0 auto'
            }
        }
    }
}

module.exports = ProfileForm;
