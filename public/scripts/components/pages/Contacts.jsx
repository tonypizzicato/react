const _               = require('lodash'),
      scrollTop       = require('../../utils/scrollTop'),
      React           = require('react'),
      mui             = require('material-ui'),

      Spacing         = mui.Styles.Spacing,

      Tabs            = mui.Tabs,
      Tab             = mui.Tab,

      ContactsActions = require('../../actions/ContactsActions'),
      ContactsStore   = require('../../stores/ContactsStore'),

      ContactForm     = require('../contacts/ContactForm.jsx'),
      ContactsList    = require('../contacts/ContactsList.jsx');

class ContactsApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.isRequired
    };

    state = {
        activeTab:       0,
        contacts:        [],
        selectedContact: {}
    };

    constructor(props) {
        super(props);

        this._onEdit      = this._onEdit.bind(this);
        this._onCancel    = this._onCancel.bind(this);
        this._onChange    = this._onChange.bind(this);
        this._onDelete    = this._onDelete.bind(this);
        this._onTabChange = this._onTabChange.bind(this);
    }

    componentDidMount() {
        ContactsStore.addChangeListener(this._onChange);

        if (this.props.leagues.length > 0) {
            ContactsActions.load();
        }
    }

    componentWillUnmount() {
        ContactsStore.removeChangeListener(this._onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.leagues.length != nextProps.leagues.length) {
            ContactsActions.load();
        }
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:       tab.props.tabIndex,
            selectedContact: {}
        });
    }

    _onChange() {
        this.setState({
            contacts:        ContactsStore.getAll(),
            selectedContact: {}
        });
    }

    _onDelete(e) {
        ContactsActions.delete(e.currentTarget.dataset.id);
    }

    _onEdit(e) {
        const id = e.currentTarget.dataset.id;

        this.setState({
            selectedContact: _.findWhere(this.state.contacts, {_id: id})
        });

        scrollTop();
    }

    _onCancel() {
        this.setState({
            selectedContact: {}
        });
    }

    shouldComponentUpdate() {
        return this.props.leagues.length > 0;
    }

    render() {
        const styles = this.getStyles();

        return (
            <Tabs>
                {this.props.leagues.map((league, index) => {
                    const contactsItems = this.state.contacts.filter(item => item.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <div>
                                <ContactForm
                                    style={styles.form}
                                    contact={this.state.selectedContact}
                                    leagueId={league._id}
                                    onCancel={this._onCancel}/>
                                <ContactsList contacts={contactsItems} onDelete={this._onDelete} onEdit={this._onEdit}/>
                            </div>
                        )
                    }

                    return (
                        <Tab onActive={this._onTabChange} label={league.name} key={league._id}>
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

module.exports = ContactsApp;
