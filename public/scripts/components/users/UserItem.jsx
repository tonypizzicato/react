import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import IconButton from 'material-ui/lib/icon-button';

class UserItem extends Component {
    static propTypes = {
        users: PropTypes.array
    };

    static defaultProps = {
        users: []
    };

    render() {
        const styles = this.getStyles();

        const avatar = this.props.user.avatar ? this.props.user.avatar : this.props.user.username[0];

        return (
            <ListItem
                href={this.props.user.vk}
                target="_blank"
                leftAvatar={<Avatar style={{top: Spacing.desktopGutter}}>{this.props.user.username[0]}</Avatar>}
                primaryText={this.props.user.username}
                secondaryTextLines={2}
                secondaryText={
                  <p>
                    <span style={styles.secondary.primary}>{this.props.user.email}</span>
                    <br/>
                    <span style={styles.secondary.secondary}>{this.props.user.vk}</span>
                  </p>
                }/>
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
