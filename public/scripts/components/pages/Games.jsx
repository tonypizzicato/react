import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import Tabs, { Tab } from 'material-ui/Tabs';

import GamesTab from '../games/GamesTab.jsx';

import CountriesActions from'../../actions/CountriesActions';
import TournamentsActions from'../../actions/TournamentsActions';
import GamesActions from'../../actions/GamesActions';
import GameArticlesActions from'../../actions/GameArticlesActions';


class GamesApp extends Component {

    static propTypes = {
        leagues:     PropTypes.object.isRequired,
        countries:   PropTypes.object.isRequired,
        tournaments: PropTypes.object.isRequired,
        games:       PropTypes.object.isRequired,
        articles:    PropTypes.object.isRequired
    };

    state = {
        activeTab: 0
    };

    constructor(props) {
        super(props);

        this._onTabChange = this._onTabChange.bind(this);
    }

    _onTabChange(tab) {
        this.setState({activeTab: tab.props.tabIndex});
    }

    componentDidMount() {
        /** load countries, tournaments and articles async and then load games by leagues */
        Promise.all([
            this.props.dispatch(CountriesActions.fetch()),
            this.props.dispatch(TournamentsActions.fetch()),
            this.props.dispatch(GameArticlesActions.fetch())
        ]).then(() => {
            this.props.leagues.items.forEach(item => {
                this.props.dispatch(GamesActions.fetch({leagueId: item._id}))
            });
        });
    }

    shouldComponentUpdate(nextProps) {
        console.log(nextProps.loaded);

        return nextProps.loaded;
    }

    render() {
        return (
            <Tabs className="s_mb_24">
                {this.props.leagues.items.map((league, index) => {

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <GamesTab
                                leagueId={league._id}
                                countries={this.props.countries.items.filter(item => item.leagueId == league._id)}
                                tournaments={this.props.tournaments.items.filter(item => item.leagueId == league._id)}
                                games={this.props.games.items}
                                articles={this.props.articles.items}
                                key={`${league._id}-tab-content`}/>
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
        loaded:      state.get('fetchesCount') == 0,
        leagues:     state.get('leagues').toJS(),
        countries:   state.get('countries').toJS(),
        tournaments: state.get('tournaments').toJS(),
        games:       state.get('games').toJS(),
        articles:    state.get('gameArticles').toJS()
    }
};

export default connect(mapState)(GamesApp);
