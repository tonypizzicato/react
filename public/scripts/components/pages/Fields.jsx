const React         = require('react'),
      mui           = require('material-ui'),

      Tabs          = mui.Tabs,
      Tab           = mui.Tab,

      FieldsActions = require('../../actions/FieldsActions'),
      FieldsStore   = require('../../stores/FieldsStore'),

      FieldsList    = require('../fields/FieldsList.jsx'),
      FieldForm     = require('../fields/FieldForm.jsx');

class FieldsApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.isRequired
    };

    state = {
        fields:        [],
        selectedField: {}
    };

    constructor(props) {
        super(props);

        this._onEdit      = this._onEdit.bind(this);
        this._onChange    = this._onChange.bind(this);
        this._onCancel    = this._onCancel.bind(this);
        this._onTabChange = this._onTabChange.bind(this);
    }

    componentDidMount() {
        FieldsStore.addChangeListener(this._onChange);

        if (this.props.leagues.length > 0) {
            FieldsActions.load();
        }
    }

    componentWillUnmount() {
        FieldsStore.removeChangeListener(this._onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.leagues.length != nextProps.leagues.length) {
            FieldsActions.load();
        }
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:     tab.props.tabIndex,
            selectedField: {}
        });
    }

    _onChange() {
        this.setState({
            fields:        FieldsStore.getAll(),
            selectedField: {}
        });
    }

    _onDelete(e) {
        FieldsActions.delete(e.currentTarget.dataset.id);
    }

    _onEdit(e) {
        this.setState({
            selectedField: this.state.fields.filter(field => field._id == e.currentTarget.dataset.id).pop()
        });
    }

    _onCancel() {
        this.setState({
            selectedField: {}
        });
    }

    render() {
        return (
            <Tabs>
                {this.props.leagues.map(league => {
                    const fieldsItems = this.state.fields.filter(item => item.leagueId == league._id);

                    return (
                    <Tab onActive={this._onTabChange} label={league.name} key={league._id}>
                        <FieldForm
                            field={this.state.selectedField}
                            leagueId={league._id}
                            onCancel={this._onCancel}
                            key={`field-form-${league._id}`}/>

                        <FieldsList
                            fields={fieldsItems}
                            onDelete={this._onDelete}
                            onEdit={this._onEdit}/>
                    </Tab>
                        );
                    })}
            </Tabs>
        );
    }
}

module.exports = FieldsApp;
