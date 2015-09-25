const React        = require('react'),
      mui          = require('material-ui'),

      Spacing      = mui.Styles.Spacing,

      DropDownMenu = mui.DropDownMenu,
      TextField    = mui.TextField,
      Checkbox     = mui.Checkbox,
      Button       = mui.FlatButton,
      Avatar       = mui.Avatar,

      AuthActions  = require('../../actions/AuthActions');


const positions = {
    photographer: 'Фотограф',
    operator:     'Оператор',
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

        this._onSave = this._onSave.bind(this);
    }

    _onSave() {
        var user = {
            username: this.refs.username.getValue(),
            email:    this.refs.email.getValue(),
            vk:       this.refs.vk.getValue(),
            leagueId: this.props.leagues[this.refs.league.state.selectedIndex]
        };

        this.setState({validation: {}});
        AuthActions.save(user);
    }

    render() {
        const styles = this.getStyles();

        return (
            <div>
                <TextField
                    style={styles.input}
                    defaultValue={this.props.user.username}
                    hintText="Введите имя пользователя"
                    floatingLabelText="Имя пользователя"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="username"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.user.email}
                    hintText="Введите почту"
                    floatingLabelText="Почта"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="email"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.user.vk}
                    hintText="Введите адрес старницы Вконтакте"
                    floatingLabelText="Старницы Вконтакте"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="vk"/>

                <DropDownMenu
                    style={styles.dropdown.root}
                    labelStyle={styles.dropdown.label}
                    underlineStyle={styles.dropdown.underline}
                    menuItems={this.props.leagues.map(item => {
                        return {text: item.name, _id: item._id, name: item.name};
                    })}
                    autoWidth={false}
                    ref="league"/>

                <div style={styles.checkbox.container}>
                    {Object.keys(positions).map(item => <Checkbox style={styles.checkbox.checkbox}
                                                                  name={`position-${item}`}
                                                                  value={item}
                                                                  label={positions[item]}/>)}
                </div>

                <Avatar style={styles.avatar} src={this.props.user.avatar} size={200}/>

                <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSave}/>
            </div>
        )
    }

    getStyles() {
        return {
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
                margin:  `${Spacing.desktopGutter}px auto`
            }
        }
    }
}

module.exports = ProfileForm;