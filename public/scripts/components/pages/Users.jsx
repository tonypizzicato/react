import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import UsersList from '../users/UsersList.jsx';

import UsersActions from '../../actions/UsersActions';

class UsersApp extends Component {

    static propTypes = {
        users: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.props.dispatch(UsersActions.fetch());
    }

    render() {
        return <UsersList users={this.props.users.items}/>;
    }
}

function mapState(state) {
    return {
        users: state.get('users').toJS()
    }
};

export default connect(mapState)(UsersApp);
