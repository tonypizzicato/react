"use strict";

var React       = require('react'),
    mui         = require('material-ui'),

    Colors      = mui.Styles.Colors,
    List        = mui.List,
    ListDivider = mui.ListDivider,

    UserItem    = require('../users/UserItem.jsx');

class UsersList extends React.Component {

    static propTypes = {
        users: React.PropTypes.array
    }

    static defaultProps = {
        users: []
    }

    render() {
        if (!this.props.users.length) {
            return false;
        }

        const items = this.props.users.map((item, index) => {
            const divider = index != this.props.users.length - 1 ? <ListDivider inset={true}/> : undefined;

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
                border: 'solid 1px ' + Colors.faintBlack
            }
        }
    }
}

module.exports = UsersList;
