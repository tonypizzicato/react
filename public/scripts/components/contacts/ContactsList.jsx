import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

import ContactItem from '../contacts/ContactItem.jsx';
import ContactsActions from '../../actions/ContactsActions';

class ContactsList extends Component {
    static propTypes = {
        contacts: PropTypes.array,
        onEdit:   PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired
    };

    static getDefaultProps = {
        contacts: []
    };

    state = {
        contacts: this.props.contacts
    };

    constructor(props) {
        super(props);

        this._onDrop = this._onDrop.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({contacts: nextProps.contacts});
    }

    _onDrop(from, to) {
        let items = this.state.contacts.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach((item, index) => {
            ContactsActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true});
        });
    }

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
                                onDelete={this.props.onDelete}
                                onDrop={this._onDrop}
                                index={index}
                                key={item._id}/>
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
