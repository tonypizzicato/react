import _ from 'lodash';
import { connect } from 'react-redux';
import scrollTop from '../../utils/scrollTop';
import React, { Component, PropTypes } from 'react';

import Tabs, { Tab } from 'material-ui/Tabs';

import CountryForm from '../countries/CountryForm.jsx';
import CountriesList from '../countries/CountriesList.jsx';

import CountriesActions from '../../actions/CountriesActions';

class CountriesApp extends Component {

    static propTypes = {
        leagues:   PropTypes.object.isRequired,
        countries: PropTypes.object.isRequired
    };

    state = {
        activeTab:       0,
        selectedCountry: {},
        addMode:         true
    };

    constructor(props) {
        super(props);

        this._onTabChange = this._onTabChange.bind(this);
        this._onDelete    = this._onDelete.bind(this);
        this._onEdit      = this._onEdit.bind(this);
        this._onSubmit    = this._onSubmit.bind(this);
        this._onCancel    = this._onCancel.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(CountriesActions.fetch());
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:       tab.props.tabIndex,
            addMode:         true,
            selectedCountry: {}
        });
    }

    _onDelete(e) {
        const id = e.currentTarget.dataset.id;

        this.props.dispatch(CountriesActions.remove(id))
            .then(() => this.props.dispatch(CountriesActions.fetch()));
    }

    _onEdit(e) {
        const id = e.currentTarget.dataset.id;

        this.setState({
            selectedCountry: _.findWhere(this.props.countries.items, {_id: id}),
            addMode:         false
        });

        scrollTop();
    }

    _onSubmit(country) {
        const actionName = this.state.addMode ? 'add' : 'save';

        this.props.dispatch(CountriesActions[actionName](country))
            .then(() => this.props.dispatch(CountriesActions.fetch()))
            .then(this._onCancel);
    }

    _onCancel() {
        this.setState({
            selectedCountry: {},
            addMode:         true
        });
    }

    render() {
        console.log('rendering Countries');

        return (
            <Tabs>
                {this.props.leagues.items.map((league, index) => {
                    const countriesItems = this.props.countries.items.filter(country => country.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        const country = this.state.selectedCountry;
                        const key     = `${country._id ? country._id : _.uniqueId()}-form`;

                        tabContent = (
                            <div>
                                <CountryForm
                                    country={country}
                                    leagueId={league._id}
                                    onSubmit={this._onSubmit}
                                    onCancel={this._onCancel}
                                    key={key}/>
                                <CountriesList
                                    countries={countriesItems}
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
}

const mapState = state => {
    return {
        countries: state.get('countries').toJS(),
        leagues:   state.get('leagues').toJS()
    }
};

export default connect(mapState)(CountriesApp);
