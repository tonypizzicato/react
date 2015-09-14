const React      = require('react'),
      mui        = require('material-ui'),

      Colors     = mui.Styles.Colors,
      Spacing    = mui.Styles.Spacing,

      ListItem   = mui.ListItem,
      Avatar     = mui.Avatar,
      IconButton = mui.IconButton;

class UserItem extends React.Component {
    static propTypes    = {
        users: React.PropTypes.array
    };

    static defaultProps = {
        users: []
    };

    render() {
        const styles = this.getStyles();

        return (
            <ListItem
                href={this.props.user.vk}
                target="_blank"
                leftAvatar={<Avatar style={{top: Spacing.desktopGutter}}>{this.props.user.username[0]}</Avatar>}
                primaryText={this.props.user.username}
                secondaryText={
                  <p>
                    <span style={styles.secondary.primary}>{this.props.user.email}</span>
                    <br/>
                    <span style={styles.secondary.secondary}>{this.props.user.vk}</span>
                  </p>
                }
                secondaryTextLines={2}/>
        );
    }

    getStyles() {
        return {
            secondary: {
                primary:   {
                    color: Colors.darkBlack
                },
                secondary: {
                    color: Colors.lightBlack
                }
            }
        }
    }
}

module.exports = UserItem;
