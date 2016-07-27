import React, { Component } from 'react';

import Spacing from 'material-ui/styles/spacing';

import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/FlatButton';

import AuthActions from '../actions/AuthActions';
import AuthStore  from '../stores/AuthStore';

class Auth extends Component {
    render() {
        return (
            <Paper style={this.getStyles().root}>
                <Tabs>
                    <Tab label="Вход">
                        <Login />
                    </Tab>
                    <Tab label="Регистрация">
                        <SignUp />
                    </Tab>
                </Tabs>
            </Paper>
        )
    }

    getStyles() {
        return {
            root: {
                width:    520,
                minWidth: 320,
                margin:   '50px auto',
                position: 'relative'
            }
        }
    }
}


class SignUp extends React.Component {

    state = {
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onSave = this._onSave.bind(this);
    }

    _onSave() {
        const user = {
            username: this.refs.username.getValue(),
            email:    this.refs.email.getValue(),
            password: this.refs.password.getValue(),
            vk:       this.refs.vk.getValue()
        };

        let validation = {},
            isValid    = true;

        function validateEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return re.test(email);
        }

        for (var field in user) {
            if (user[field].length == 0) {
                validation[field] = true;
                isValid           = false;
            }
        }

        validation.email = !validateEmail(user.email);
        isValid          = isValid && !validation.email;

        this.setState({ validation: validation });
        if (isValid) {
            AuthActions.signup(user);
        }
    }

    render() {
        return (
            <div style={this.getStyles().root}>
                <TextField
                    className="s_display_block"
                    hintText="Ваше имя"
                    floatingLabelText="Имя"
                    errorText={this.state.validation.username ? 'Поле не может быть пустым' : null}
                    fullWidth={true}
                    ref="username"/>

                <TextField
                    className="s_display_block"
                    hintText="your@e.mail"
                    floatingLabelText="Email"
                    errorText={this.state.validation.email ? 'Поле не заполнено или заполнено неверно' : null}
                    type="email"
                    fullWidth={true}
                    ref="email"/>

                <TextField
                    className="s_display_block"
                    hintText="password"
                    floatingLabelText="Пароль"
                    errorText={this.state.validation.password ? 'Поле не может быть пустым' : null}
                    type="password"
                    fullWidth={true}
                    ref="password"/>

                <TextField
                    className="s_display_block"
                    hintText="https://vk.com/id111111"
                    floatingLabelText="Адрес страницы Вконтакте"
                    errorText={this.state.validation.vk ? 'Поле не может быть пустым' : null}
                    type="text"
                    fullWidth={true}
                    ref="vk"/>

                <Button style={this.getStyles().button} label="Продолжить" secondary={true} onClick={this._onSave}/>

            </div>

        );
    }

    getStyles() {
        return {
            root:   {
                padding: '0 24px 24px'
            },
            button: {
                width:     '100%',
                marginTop: Spacing.desktopGutter
            }
        }
    }
}

var Login = React.createClass({
    getInitialState() {
        return {
            validation: {}
        }
    },

    componentDidMount() {
        AuthStore.addChangeListener(this._onLogin);
        AuthStore.addUnauthorizedListener(this._onError);
    },

    componentWillUnmount() {
        AuthStore.removeChangeListener(this._onLogin);
        AuthStore.removeUnauthorizedListener(this._onError);
    },

    _onError(e) {
        if (e.status == 401) {
            this.refs.errCredentials.show();
        } else {
            this.refs.errConnection.show();
        }
    },

    _onSave() {
        const user = {
            email:    this.refs.email.getValue(),
            password: this.refs.password.getValue()
        };

        let validation = {},
            isValid    = true;

        for (var field in user) {
            if (user[field].length == 0) {
                validation[field] = true;
                isValid           = false;
            }
        }

        this.setState({
            validation: validation
        });
        if (isValid) {
            AuthActions.login(user.email, user.password);
        }
    },

    _onLogin() {
        if (!AuthStore.loggedIn()) {
            window.location = '/';
        }

        this.refs.form.getDOMNode().submit();

        window.location = '/';
    },

    _onSubmit(e) {
        e.preventDefault();
    },

    render() {
        return (
            <div style={this.getStyles().root}>
                <form ref="form" actions="login" onSubmit={this._onSubmit}>
                    <TextField
                        className="s_display_block"
                        hintText="your@e.mail"
                        floatingLabelText="Email"
                        errorText={this.state.validation.email ? 'Поле не может быть пустым' : null}
                        type="email"
                        fullWidth={true}
                        ref="email"/>

                    <TextField
                        className="s_display_block"
                        hintText="password"
                        floatingLabelText="Пароль"
                        errorText={this.state.validation.password ? 'Поле не может быть пустым' : null}
                        type="password"
                        fullWidth={true}
                        ref="password"/>

                    <Button style={this.getStyles().button} label="Продолжить" secondary={true} onClick={this._onSave}/>
                </form>
                <Snackbar
                    message="Неверный логин или пароль"
                    ref="errCredentials"/>

                <Snackbar
                    message="Уууупс! Произошла ошибка при выполнении запроса."
                    ref="errConnection"/>
            </div>
        );
    },

    getStyles() {
        return {
            root:   {
                padding: '0 24px 24px'
            },
            button: {
                width:     '100%',
                marginTop: Spacing.desktopGutter
            }
        }
    }
});

var Logout = React.createClass({

    componentDidMount() {
        AuthStore.addChangeListener(this._onLogout);
        AuthActions.logout();
    },

    componentWillUnmount() {
        AuthStore.removeChangeListener(this._onLogout);
    },

    _onLogout() {
        if (!AuthStore.loggedIn()) {
            window.location = '/';
        }
    },

    render() {
        return (<div />);
    }
});

export default Auth;

export {
    Auth as default,
    Login,
    Logout,
    SignUp,
}

