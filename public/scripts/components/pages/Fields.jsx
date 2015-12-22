import _ from 'lodash';
import scrollTop from '../../utils/scrollTop';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import FieldForm from '../fields/FieldForm.jsx';
import FieldsList from '../fields/FieldsList.jsx';

import FieldsActions from '../../actions/FieldsActions';
import TournamentsActions from '../../actions/TournamentsActions';

class FieldsApp extends Component {

    static propTypes = {
        leagues: PropTypes.object.isRequired,
        fields:  PropTypes.object.isRequired
    };

    state = {
        activeTab:     0,
        selectedField: {},
        addMode:       true
    };

    constructor(props) {
        super(props);

        this._onEdit      = this._onEdit.bind(this);
        this._onSort      = this._onSort.bind(this);
        this._onSubmit    = this._onSubmit.bind(this);
        this._onCancel    = this._onCancel.bind(this);
        this._onTabChange = this._onTabChange.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(FieldsActions.fetch());
        this.props.dispatch(TournamentsActions.fetch());
    }

    shouldComponentUpdate(nextProps) {
        return !nextProps.fetchesCount;
    }

    _onTabChange(tab) {
        if (tab.props.tabIndex == this.state.activeTab) {
            return;
        }

        this.setState({
            activeTab:     tab.props.tabIndex,
            selectedField: {},
            addMode:       true
        });
    }

    _onEdit(e) {
        this.setState({
            selectedField: this.props.fields.toJS().filter(field => field._id == e.currentTarget.dataset.id).pop(),
            addMode:       false
        });
    }

    _onSort(field) {
        this.props.dispatch(FieldsActions.save(field));
    }

    _onSubmit(field) {
        const actionName = this.state.addMode ? 'add' : 'save';

        this.props.dispatch(FieldsActions[actionName](field))
            .then(() => this.props.dispatch(FieldsActions.fetch()))
            .then(this._onCancel);
    }

    _onCancel() {
        this.setState({
            selectedField: {},
            addMode:       true
        });
    }

    render() {
        return (
            <Tabs>
                {this.props.leagues.toJS().map((league, index) => {
                    const fieldsItems = this.props.fields.toJS().filter(item => item.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        const field = this.state.selectedField;
                        const key   = `${field._id ? field._id : _.uniqueId()}-form`;

                        tabContent = (
                            <div>
                                <FieldForm
                                    field={this.state.selectedField}
                                    leagueId={league._id}
                                    tournaments={this.props.tournaments.toJS()}
                                    onSubmit={this._onSubmit}
                                    onCancel={this._onCancel}
                                    key={key}/>

                                <FieldsList
                                    fields={fieldsItems}
                                    onSort={this._onSort}
                                    onEdit={this._onEdit}
                                    onDelete={this._onDelete}/>
                            </div>
                        )
                    }

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <div>
                                <FieldForm
                                    field={this.state.selectedField}
                                    leagueId={league._id}
                                    onCancel={this._onCancel}
                                    key={`field-form-${league._id}-${this.state.selectedField._id}`}
                                />

                                <FieldsList
                                    fields={fieldsItems}
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
}

function mapState(state) {
    return {
        leagues:     state.getIn(['leagues', 'items']),
        tournaments: state.getIn(['tournaments', 'items']),
        fields:      state.getIn(['fields', 'items'])
    }
}

export default connect(mapState)(FieldsApp);
