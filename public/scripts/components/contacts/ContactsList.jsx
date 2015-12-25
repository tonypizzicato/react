import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

import ContactItem from '../contacts/ContactItem.jsx';
import ContactsActions from '../../actions/ContactsActions';

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
                {this.props.contacts.map((item, index) => {
                    const divider = index != this.props.contacts.length - 1 ? <Divider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <ContactItem
                                contact={item}
                                onEdit={this.props.onEdit}
                                onDelete={this.props.onDelete}/>
                            {divider}
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

module.exports = ContactsList;
