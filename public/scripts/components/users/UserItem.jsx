import React, { Component, PropTypes} from 'react';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';

class UserItem extends Component {
    static propTypes = {
        users: PropTypes.array
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

export default UserItem;
