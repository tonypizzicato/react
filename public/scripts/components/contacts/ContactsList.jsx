import React, { Component, PropTypes } from 'react';


import List from 'material-ui/List';
import Colors from 'material-ui/styles/colors';

import ContactItem from '../contacts/ContactItem.jsx';

class ContactsList extends Component {
    static propTypes = {
        contacts: PropTypes.array.isRequired,
        onEdit:   PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired
    };

    render() {
        if (!this.props.contacts.length) {
            return false;
        }

        return (
            <List style={this.getStyles().root}>
                {this.props.contacts.map(item => <ContactItem contact={item}
                                                              onEdit={this.props.onEdit}
                                                              onDelete={this.props.onDelete}
                                                              key={item._id}/>
                )}
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

module.exports = ContactsList;
