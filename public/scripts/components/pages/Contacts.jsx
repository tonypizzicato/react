import _ from 'lodash';
import scrollTop from '../../utils/scrollTop';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Spacing from 'material-ui/lib/styles/spacing';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import ContactForm from '../contacts/ContactForm.jsx';
import ContactsList from '../contacts/ContactsList.jsx';

import TournamentsActions from '../../actions/TournamentsActions';
import ContactsActions from '../../actions/ContactsActions';

class ContactsApp extends Component {

    static propTypes = {
        leagues:     PropTypes.object.isRequired,
        tournaments: PropTypes.object.isRequired
    };

    state = {
        activeTab:       0,
        selectedContact: {},
        addMode:         true
    };

    constructor(props) {
        super(props);

        this._onEdit      = this._onEdit.bind(this);
        this._onSubmit    = this._onSubmit.bind(this);
        this._onCancel    = this._onCancel.bind(this);
        this._onDelete    = this._onDelete.bind(this);
        this._onTabChange = this._onTabChange.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(TournamentsActions.fetch());
        this.props.dispatch(ContactsActions.fetch());
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:       tab.props.tabIndex,
            selectedContact: {}
        });
    }

    _onDelete(e) {
        const id = e.currentTarget.dataset.id;

        this.props.dispatch(ContactsActions.remove(id))
            .then(() => this.props.dispatch(ContactsActions.fetch()))
            .then(this._onCancel);
    }

    _onEdit(e) {
        const id = e.currentTarget.dataset.id;

        this.setState({
            selectedContact: _.findWhere(this.props.contacts.items, {_id: id}),
            addMode:         false
        });

        scrollTop();
    }

    _onSubmit(conact) {
        const actionName = this.state.addMode ? 'add' : 'save';

        this.props.dispatch(ContactsActions[actionName](conact))
            .then(() => this.props.dispatch(ContactsActions.fetch()))
            .then(this._onCancel);
    }

    _onCancel() {
        this.setState({
            selectedContact: {},
            addMode:         true
        });
    }

    render() {
        console.log('rendering Contacts');

        const styles = this.getStyles();

        return (
            <Tabs>
                {this.props.leagues.items.map((league, index) => {
                    const contactsItems = this.props.contacts.items.filter(item => item.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        const contact = this.state.selectedContact;
                        const key     = `${contact._id ? contact._id : _.uniqueId()}-form`;

                        tabContent = (
                            <div>
                                <ContactForm
                                    style={styles.form}
                                    tournaments={this.props.tournaments.items}
                                    contact={this.state.selectedContact}
                                    leagueId={league._id}
                                    onSubmit={this._onSubmit}
                                    onCancel={this._onCancel}
                                    key={key}/>

                                <ContactsList
                                    contacts={contactsItems}
                                    leagueId={league._id}
                                    onDelete={this._onDelete}
                                    onEdit={this._onEdit}/>
                            </div>
                        )
                    }

                    return (
                        <Tab label={league.name} onActive={this._onTabChange} key={league._id}>
                            {tabContent}
                        </Tab>
                    );
                })}
            </Tabs>
        );
    }

    getStyles() {
        return {
            form: {
                marginBottom: Spacing.desktopGutter
            }
        }
    }
}

const mapState = state => {
    return {
        leagues:     state.get('leagues').toJS(),
        tournaments: state.get('tournaments').toJS(),
        contacts:    state.get('contacts').toJS()
    }
};

export default connect(mapState)(ContactsApp);
