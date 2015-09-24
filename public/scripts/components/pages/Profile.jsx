const _            = require('lodash'),
      React        = require('react'),
      mui          = require('material-ui'),

      Spacing            = mui.Styles.Spacing,

      Paper        = mui.Paper,
      DropDownMenu = mui.DropDownMenu,

      AuthStore    = require('../../stores/AuthStore');

class ProfileApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.required
    };

    state = {
        user: AuthStore.getUser()
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

        return (
            <Paper style={styles.root}>
                <h3>{this.state.user.username}</h3>

                <DropDownMenu
                    style={styles.dropdown.root}
                    labelStyle={styles.dropdown.label}
                    underlineStyle={styles.dropdown.underline}
                    menuItems={this.props.leagues.map(item => {
                        return {text: item.name, _id: item._id, name: item.name};
                    })}
                    autoWidth={false}
                    ref="country"/>
            </Paper>
        );
    }

    getStyles() {
        return {
            root:     {
                padding: Spacing.desktopGutter
            },
            dropdown: {
                root:      {
                    width: 200
                },
                label:     {
                    paddingLeft: 0
                },
                underline: {
                    margin: '-1px 12px 0 0'
                }
            }
        }
    }
}

module.exports = ProfileApp;
