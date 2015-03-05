"use strict";

var React       = require('react'),
    Router      = require('react-router'),
    mui         = require('material-ui'),

    Tabs        = mui.Tabs,
    Tab         = mui.Tab,

    TextField   = mui.TextField,
    Button      = mui.RaisedButton,

    AuthActions = require('../actions/AuthActions'),
    AuthStore   = require('../stores/AuthStore');

var Auth = React.createClass({

    render: function () {
        return (
            <Tabs>
                <Tab label="Login" >
                    <Login />
                </Tab>
                <Tab label="Signup" >
                    <SignUp />
                </Tab>
            </Tabs>
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
            password: this.refs.password.getValue()
        }

        var validation = {},
            isValid = true;

        for (var field in user) {
            if (user[field].length == 0) {
                validation[field] = true;
                isValid = false;
            }
        }

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
                    hintText="Your Name"
                    floatingLabelText="Name"
                    errorText={this.state.validation.username ? 'Поле не может быть пустым' : null}
                    ref="username" />

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
                    floatingLabelText="Password"
                    errorText={this.state.validation.password ? 'Поле не может быть пустым' : null}
                    type="password"
                    ref="password" />

                <Button className="button_type_save s_float_r s_mt_36" label="SignUp" secondary={true} onClick={this._onSave} />

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
    },

    componentWillUnmount: function () {
        AuthStore.removeChangeListener(this._onLogin);
    },

    _onSave: function () {
        var user = {
            email:    this.refs.email.getValue(),
            password: this.refs.password.getValue()
        }

        var validation = {},
            isValid = true;

        for (var field in user) {
            if (user[field].length == 0) {
                validation[field] = true;
                isValid = false;
            }
        }

        this.setState({validation: validation});
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
                    floatingLabelText="Password"
                    errorText={this.state.validation.password ? 'Поле не может быть пустым' : null}
                    type="password"
                    ref="password" />

                <Button className="button_type_save s_float_r s_mt_36" label="Login" secondary={true} onClick={this._onSave} />
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
    SignUp:         Auth,
    Login:          Auth,
    Logout:         Logout,
    Authentication: Authentication
};
