import _ from 'lodash';
import { connect } from 'react-redux';
import scrollTop from '../../utils/scrollTop';
import React, { Component, PropTypes } from 'react';

import Tabs, { Tab } from 'material-ui/Tabs';

import TournamentForm from '../tournaments/TournamentForm.jsx';
import TournamentsList from '../tournaments/TournamentsList.jsx';

import CountriesActions from '../../actions/CountriesActions';
import TournamentsActions from '../../actions/TournamentsActions';

class TournamentApp extends React.Component {

    static propTypes = {
        leagues:     React.PropTypes.object.isRequired,
        countries:   React.PropTypes.object.isRequired,
        tournaments: React.PropTypes.object.isRequired
    };

    state = {
        activeTab:          0,
        selectedTournament: {}
    };

    constructor(props) {
        super(props);

        this._onTabChange = this._onTabChange.bind(this);
        this._onEdit      = this._onEdit.bind(this);
        this._onSubmit    = this._onSubmit.bind(this);
        this._onCancel    = this._onCancel.bind(this);
    }

    componentDidMount() {
        if (this.props.leagues.items.length) {
            this.props.dispatch(CountriesActions.fetch());
            this.props.dispatch(TournamentsActions.fetch());
        }
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:          tab.props.tabIndex,
            selectedTournament: {}
        });
    }

    _onEdit(id) {
        this.setState({
            selectedTournament: _.findWhere(this.props.tournaments.items, { _id: id })
        });

        scrollTop();
    }

    _onSubmit(tournament) {
        this.props.dispatch(TournamentsActions.save(tournament))
            .then(() => this.props.dispatch(TournamentsActions.fetch()))
            .then(this._onCancel);
    }

    _onCancel() {
        this.setState({
            selectedTournament: {}
        });
    }

    render() {
        console.log('rendering Tournaments');

        return (
            <Tabs>
                {this.props.leagues.items.map((league, index) => {
                    const tournamentsItems = this.props.tournaments.items.filter(tournament => tournament.leagueId == league._id);
                    const countries        = this.props.countries.items.filter(country => country.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        const tournament = this.state.selectedTournament;
                        const key        = `${tournament._id ? tournament._id : _.uniqueId()}-form`;

                        tabContent = (
                            <div>
                                <TournamentForm
                                    tournament={this.state.selectedTournament}
                                    countries={countries}
                                    leagueId={league._id}
                                    onSubmit={this._onSubmit}
                                    onCancel={this._onCancel}
                                    key={key}/>
                                <TournamentsList
                                    tournaments={tournamentsItems}
                                    onEdit={this._onEdit}/>
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
}

const mapState = state => {
    return {
        leagues:     state.get('leagues').toJS(),
        countries:   state.get('countries').toJS(),
        tournaments: state.get('tournaments').toJS()
    }
};

export default connect(mapState)(TournamentApp);
