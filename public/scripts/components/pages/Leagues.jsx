"use strict";

const _               = require('lodash'),
    React           = require('react'),
    mui             = require('material-ui'),

    LeaguesStore    = require('../../stores/LeaguesStore'),

    LeagueForm      = require('../leagues/LeagueForm.jsx'),
    LeaguesList     = require('../leagues/LeaguesList.jsx');

class LeaguesApp extends React.Component {

    propTypes = {
        leagues: React.PropTypes.array.required
    }

    state = {
        selectedLeague: {}
    }

    constructor(props) {
        super(props);

        this._onEdit   = this._onEdit.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onCancel = this._onCancel.bind(this);
    }

    componentDidMount() {
        LeaguesStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        LeaguesStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            selectedLeague: {}
        });
    }

    _onEdit(e) {
        this.setState({
            selectedLeague: _.findWhere(this.props.leagues, {_id: e.currentTarget.dataset.id})
        });
    }

    _onCancel() {
        this.setState({
            selectedLeague: {}
        });
    }

    render() {
        return (
            <div>
                <LeagueForm league={this.state.selectedLeague} onCancel={this._onCancel}
                            key={this.state.selectedLeague._id + '-league-form'}/>
                <LeaguesList leagues={this.props.leagues} onEdit={this._onEdit} key="leagues-list"/>
            </div>
        );
    }
}

module.exports = LeaguesApp;
