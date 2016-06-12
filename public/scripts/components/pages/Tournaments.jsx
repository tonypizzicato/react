var $                  = require('jquery'),
    _                  = require('lodash'),
    scroll             = require('../../utils/scrollTo'),
    React              = require('react'),
    mui                = require('material-ui'),

    Tabs               = mui.Tabs,
    Tab                = mui.Tab,

    EventsConstants    = require('../../constants/EventsConstants'),
    CountriesActions   = require('../../actions/CountriesActions'),
    CountriesStore     = require('../../stores/CountriesStore'),
    TournamentsActions = require('../../actions/TournamentsActions'),
    TournamentStore    = require('../../stores/TournamentsStore'),

    TournamentForm     = require('../tournaments/TournamentForm.jsx'),
    TournamentsList    = require('../tournaments/TournamentsList.jsx');

var _calls = [],
    _deferred;

class TournamentApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.isRequired
    };

    state = {
        activeTab:          0,
        countries:          [],
        tournaments:        [],
        selectedTournament: {},
        mounted:            false
    };

    constructor(props) {
        super(props);

        this._onTabChange = this._onTabChange.bind(this);
        this._onChange    = this._onChange.bind(this);
        this._onEdit      = this._onEdit.bind(this);
        this._onCancel    = this._onCancel.bind(this);
    }

    componentDidMount() {
        this.state.mounted = true;

        _calls    = [];
        _deferred = new $.Deferred();

        _deferred.then(function () {
            if (!this.state.mounted) {
                return;
            }

            this.setState({
                countries:          CountriesStore.getAll(),
                tournaments:        TournamentStore.getAll(),
                selectedTournament: {}
            });
        }.bind(this));

        TournamentStore.addChangeListener(this._onChange);

        CountriesStore.addListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.addListener(EventsConstants.EVENT_CALL, this._onCall);

        if (this.props.leagues.length) {
            CountriesActions.load();
            TournamentsActions.load();
        }
    }

    componentWillUnmount() {
        this.state.mounted = false;

        TournamentStore.removeChangeListener(this._onChange);

        CountriesStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
        TournamentStore.removeListener(EventsConstants.EVENT_CALL, this._onCall);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.leagues.length !== this.props.leagues.length) {
            CountriesActions.load();
            TournamentsActions.load();
        }
    }

    _onCall(call) {
        _calls.push(call);

        if (_calls.length == 2) {
            $.when(_calls[0], _calls[1]).done(function () {
                _deferred.resolve();
            }.bind(this));
        }
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:          tab.props.tabIndex,
            selectedTournament: {}
        });
    }

    _onChange() {
        this.setState({
            selectedTournament: {}
        });
    }

    _onEdit(id) {
        this.setState({
            selectedTournament: _.findWhere(this.state.tournaments, {_id: id})
        });

        _.defer(() => {
            scroll.scrollTo(0, 800, scroll.easing.easeOutQuad);
        });
    }

    _onCancel() {
        this.setState({
            selectedTournament: {}
        });
    }

    shouldComponentUpdate() {
        return this.props.leagues.length > 0;
    }

    render() {
        return (
            <Tabs>
                {this.props.leagues.map((league, index) => {
                    const tournamentsItems = this.state.tournaments.filter(tournament => tournament.leagueId == league._id);
                    const countries        = this.state.countries.filter(country => country.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <div>
                                <TournamentForm
                                    tournament={this.state.selectedTournament}
                                    countries={countries}
                                    leagueId={league._id}
                                    onCancel={this._onCancel}/>
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

module.exports = TournamentApp;
