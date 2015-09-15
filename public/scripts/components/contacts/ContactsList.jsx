const React           = require('react'),
      mui             = require('material-ui'),

      Spacing         = mui.Styles.Spacing,
      Colors          = mui.Styles.Colors,

      List            = mui.List,
      ListDivider     = mui.ListDivider,

      ContactItem     = require('../contacts/ContactItem.jsx'),

      ContactsActions = require('../../actions/ContactsActions');

class ContactsList extends React.Component {
    static propTypes = {
        contacts: React.PropTypes.array,
        onEdit:   React.PropTypes.func.required,
        onDelete: React.PropTypes.func.required
    };

    static getDefaultProps = {
        contacts: []
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
                    const divider = index != this.props.contacts.length - 1 ? <ListDivider inset={true}/> : undefined;

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
                paddingTop: Spacing.desktopGutterLess,
                border:     'solid 1px ' + Colors.faintBlack
            }
        }
    }
}

module.exports = ContactsList;
