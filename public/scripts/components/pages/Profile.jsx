const _           = require('lodash'),
      React       = require('react'),
      mui         = require('material-ui'),

      Spacing     = mui.Styles.Spacing,

      Paper       = mui.Paper,

      ProfileForm = require('../profile/ProfileForm.jsx'),

      AuthStore   = require('../../stores/AuthStore');

class ProfileApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.required
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
                <ProfileForm leagues={this.props.leagues} user={user}/>
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

module.exports = ProfileApp;
