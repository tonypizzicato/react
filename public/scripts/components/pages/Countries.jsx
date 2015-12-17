import _ from 'lodash';
import scroll from '../../utils/scrollTo';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

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
        selectedCountry: {}
    };

    constructor(props) {
        super(props);

        this._onTabChange = this._onTabChange.bind(this);
        this._onChange    = this._onChange.bind(this);
        this._onDelete    = this._onDelete.bind(this);
        this._onEdit      = this._onEdit.bind(this);
        this._onCancel    = this._onCancel.bind(this);
    }

    componentDidMount() {
        // Load entities
        this.props.dispatch(CountriesActions.fetch());
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:       tab.props.tabIndex,
            selectedCountry: {}
        });
    }

    _onChange() {
        this.setState({
            selectedCountry: {}
        });
    }

    _onDelete(e) {
        CountriesActions.delete(e.currentTarget.dataset.id);
    }

    _onEdit(e) {
        const id = e.currentTarget.dataset.id;

        this.setState({
            selectedCountry: _.findWhere(this.props.countries.items, {_id: id})
        });

        _.defer(() => {
            scroll.scrollTo(0, 800, scroll.easing.easeOutQuad);
        });
    }

    _onCancel() {
        this.setState({
            selectedCountry: {}
        });
    }

    render() {
        return (
            <Tabs>
                {this.props.leagues.items.map((league, index) => {
                    const countriesItems = this.props.countries.items.filter(country => country.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <div>
                                <CountryForm
                                    country={this.state.selectedCountry}
                                    leagueId={league._id}
                                    onCancel={this._onCancel}
                                    key={`${this.state.selectedCountry._id}-form`}/>
                                <CountriesList
                                    countries={countriesItems}
                                    leagueId={league._id}
                                    onDelete={this._onDelete}
                                    onEdit={this._onEdit}
                                    key={`${this.state.selectedCountry._id}-list`}/>
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

export default connect(state => state.toJS())(CountriesApp);
