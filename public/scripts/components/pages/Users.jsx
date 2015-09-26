"use strict";

const React        = require('react'),
      mui          = require('material-ui'),

      UsersActions = require('../../actions/UsersActions'),
      UsersStore   = require('../../stores/UsersStore'),

      UsersList    = require('../users/UsersList.jsx');

class UsersApp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            users: []
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        UsersStore.addChangeListener(this._onChange);

        UsersActions.load();
    }

    componentWillUnmount() {
        UsersStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({users: UsersStore.getAll()});
    }

    render() {
        return <UsersList users={this.state.users}/>;
    }
}

module.exports = UsersApp;
