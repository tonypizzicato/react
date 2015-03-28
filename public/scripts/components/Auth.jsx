"use strict";

var React       = require('react'),
    Router      = require('react-router'),
    mui         = require('material-ui'),

    Paper       = mui.Paper,
    Tabs        = mui.Tabs,
    Tab         = mui.Tab,
    Snackbar    = mui.Snackbar,

    TextField   = mui.TextField,
    Button      = mui.RaisedButton,

    AuthActions = require('../actions/AuthActions'),
    AuthStore   = require('../stores/AuthStore');

var Auth = React.createClass({

    render: function () {
        return (
            <Paper className="login-form">
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
});


var SignUp = React.createClass({

    getInitialState: function () {
        return {
            validation: {}
        }
    },

    _onSave: function () {
        var user = {
            username: this.refs.username.getValue(),
            email:    this.refs.email.getValue(),
            password: this.refs.password.getValue(),
            vk:       this.refs.vk.getValue()
        }

        var validation = {},
            isValid = true;

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        for (var field in user) {
            if (user[field].length == 0) {
                validation[field] = true;
                isValid = false;
            }
        }

        validation.email = !validateEmail(user.email);
        isValid = isValid && !validation.email;

        this.setState({validation: validation});
        if (isValid) {
            AuthActions.signup(user);
        }
    },

    render: function () {
        return (
            <div className="panel">
                <TextField
                    className="s_display_block"
                    hintText="Ваше имя"
                    floatingLabelText="Имя"
                    errorText={this.state.validation.username ? 'Поле не может быть пустым' : null}
                    ref="username" />

                <TextField
                    className="s_display_block"
                    hintText="your@e.mail"
                    floatingLabelText="Email"
                    errorText={this.state.validation.email ? 'Поле не заполнено или заполнено неверно' : null}
                    type="email"
                    ref="email" />

                <TextField
                    className="s_display_block"
                    hintText="password"
                    floatingLabelText="Пароль"
                    errorText={this.state.validation.password ? 'Поле не может быть пустым' : null}
                    type="password"
                    ref="password" />

                <TextField
                    className="s_display_block"
                    hintText="https://vk.com/id111111"
                    floatingLabelText="Адрес страницы Вконтакте"
                    errorText={this.state.validation.vk ? 'Поле не может быть пустым' : null}
                    type="text"
                    ref="vk" />

                <Button className="button_type_save s_width_full s_mt_24" label="Продолжить" secondary={true} onClick={this._onSave} />

            </div>

        );
    }
});
var Login = React.createClass({
    mixins: [Router.Navigation, Router.State],

    getInitialState: function () {
        return {
            validation: {}
        }
    },

    componentDidMount: function () {
        AuthStore.addChangeListener(this._onLogin);
        AuthStore.addUnauthorizedListener(this._onError);
    },

    componentWillUnmount: function () {
        AuthStore.removeChangeListener(this._onLogin);
        AuthStore.removeUnauthorizedListener(this._onError);
    },

    _onError: function (e) {
        if (e.status == 401) {
            this.refs.errCredentials.show();
        } else {
            this.refs.errConnection.show();
        }
    },

    _onSave: function () {
        var user = {
            email:    this.refs.email.getValue(),
            password: this.refs.password.getValue()
        };

        var validation = {},
            isValid = true;

        for (var field in user) {
            if (user[field].length == 0) {
                validation[field] = true;
                isValid = false;
            }
        }

        this.setState({
            validation: validation
        });
        if (isValid) {
            AuthActions.login(user.email, user.password);
        }
    },

    _onLogin: function () {
        if (!AuthStore.loggedIn()) {
            this.replaceWith('/');
        }

        var nextPath = this.getQuery().nextPath;

        if (nextPath) {
            this.transitionTo(nextPath);
        } else {
            this.replaceWith('/');
        }
    },

    render: function () {
        return (
            <div className="panel">
                <TextField
                    className="s_display_block"
                    hintText="your@e.mail"
                    floatingLabelText="Email"
                    errorText={this.state.validation.email ? 'Поле не может быть пустым' : null}
                    type="email"
                    ref="email" />

                <TextField
                    className="s_display_block"
                    hintText="password"
                    floatingLabelText="Пароль"
                    errorText={this.state.validation.password ? 'Поле не может быть пустым' : null}
                    type="password"
                    ref="password" />

                <Button className="button_type_save s_width_full s_mt_24" label="Продолжить" secondary={true} onClick={this._onSave} />

                <Snackbar
                    message="Неверный логин или пароль"
                    ref="errCredentials" />

                <Snackbar
                    message="Уууупс! Произошла ошибка при выполнении запроса."
                    ref="errConnection" />
            </div>
        );
    }
});

var Logout = React.createClass({

    mixins: [Router.Navigation, Router.State],

    componentDidMount: function () {
        AuthStore.addChangeListener(this._onLogout);
        AuthActions.logout();
    },

    componentWillUnmount: function () {
        AuthStore.removeChangeListener(this._onLogout);
    },

    _onLogout: function () {
        if (!AuthStore.loggedIn()) {
            this.replaceWith('/');
        }
    },

    render: function () {
        return (<div />);
    }
});


var Authentication = {
    statics: {
        willTransitionTo: function (transition) {
            var nextPath = transition.path;
            if (!AuthStore.loggedIn()) {
                transition.redirect('/login', {},
                    {'nextPath': nextPath});
            }
        }
    }
};

module.exports = {
    Auth:           Auth,
    SignUp:         Auth,
    Login:          Auth,
    Logout:         Logout,
    Authentication: Authentication
};
