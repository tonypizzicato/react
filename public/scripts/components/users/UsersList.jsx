import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/styles/colors';
import List from 'material-ui/List';

import UserItem from '../users/UserItem.jsx';

class UsersList extends Component {

    static propTypes = {
        users: PropTypes.array.isRequired
    };

    render() {
        return (
            <List style={this.getStyles().root}>
                {this.props.users.map((item, index) => {
                    return (
                        <div key={item._id}>
                            <UserItem user={item}/>
                        </div>
                    )
                })}
            </List>
        );
    }

    getStyles() {
        return {
            root: {
                paddingTop:    0,
                paddingBottom: 0,
                border:        'solid 1px ' + Colors.faintBlack
            }
        }
    }
}

module.exports = UsersList;
