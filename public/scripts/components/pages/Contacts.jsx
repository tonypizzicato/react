const _               = require('lodash'),
      scroll             = require('../../utils/scrollTo'),
      React           = require('react'),
      mui             = require('material-ui'),

      Tabs            = mui.Tabs,
      Tab             = mui.Tab,

      ContactsActions = require('../../actions/ContactsActions'),
      ContactsStore   = require('../../stores/ContactsStore'),

      ContactForm     = require('../contacts/ContactForm.jsx'),
      ContactsList    = require('../contacts/ContactsList.jsx');

class ContactsApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.required
    };

    state = {
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

    _onTabChange() {
        this.setState({
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
        this.setState({
            selectedContact: _.findWhere(this.props.contacts, {_id: e.target.dataset.id})
        });

        _.defer(() => {
            scroll.scrollTo(0, 800, scroll.easing.easeOutQuad);
        });
    }

    _onCancel() {
        this.setState({
            selectedContact: {}
        });
    }

    render() {
        const tabItems = this.props.leagues.map(league => {
            const contactsItems = this.state.contacts.filter(item => item.leagueId == league._id);

            return (
                <Tab label={league.name} key={league._id}>
                    <ContactForm contact={this.state.selectedContact} leagueId={league._id} onCancel={this._onCancel}/>
                    <ContactsList contacts={contactsItems} onDelete={this._onDelete} onEdit={this._onEdit}/>
                </Tab>
            );
        });
        return (
            <Tabs onChange={this._onTabChange}>{tabItems}</Tabs>
        );
    }
}

module.exports = ContactsApp;
