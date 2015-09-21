const _        = require('lodash'),
      React    = require('react'),
      mui      = require('material-ui'),

      Tabs     = mui.Tabs,
      Tab      = mui.Tab,

      GamesTab = require('../games/GamesTab.jsx');


class GamesApp extends React.Component {

    static defaultProps = {
        leagues: [],
        games:   []
    };

    static propTypes = {
        leagues: React.PropTypes.array.required,
        games:   React.PropTypes.array.required
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

    render() {
        return (
            <Tabs className="s_mb_24">
                {this.props.leagues.map((league, index) => {

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <GamesTab
                                leagueId={league._id}
                                games={this.props.games}
                                key={`${league._id}-tab-content`}/>
                        )
                    }

                    return (
                        <Tab label={league.name} onActive={this._onTabChange} key={league._id + '-tab'}>
                            {tabContent}
                        </Tab>
                    );
                })}
            </Tabs>
        );
    }
}

module.exports = GamesApp;
