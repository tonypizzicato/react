import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

import UserItem from '../users/UserItem.jsx';

class UsersList extends Component {

    static propTypes = {
        users: PropTypes.array
    };

    static defaultProps = {
        users: []
    };

    render() {
        if (!this.props.users.length) {
            return false;
        }

        const items = this.props.users.map((item, index) => {
            const divider = index != this.props.users.length - 1 ? <Divider inset={true}/> : undefined;

            return (
                <div key={item._id}>
                    <UserItem user={item}/>
                    {divider}
                </div>
            )
        });

        return (
            <List style={this.getStyles().root}>
                {items}
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
