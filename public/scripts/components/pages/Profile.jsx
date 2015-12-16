import _ from 'lodash';
import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import Spacing from 'material-ui/lib/styles/spacing';

import Paper from 'material-ui/lib/paper';

import ProfileForm from '../profile/ProfileForm.jsx';

import AuthStore from '../../stores/AuthStore';

class ProfileApp extends Component {

    static propTypes = {
        leagues: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this._onCancel = this._onCancel.bind(this);
    }

    _onCancel() {
        this.setState({
            user: AuthStore.getUser()
        });
    }

    render() {
        const styles = this.getStyles();

        const user = AuthStore.getUser();

        return (
            <Paper style={styles.root}>
                <ProfileForm leagues={this.props.leagues.items} user={user}/>
            </Paper>
        );
    }

    getStyles() {
        return {
            root: {
                padding: Spacing.desktopGutter
            }
        }
    }
}

export default connect(state => state.toJS())(ProfileApp);
