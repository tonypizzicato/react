const _                = require('lodash'),
      scroll           = require('../../utils/scrollTo'),
      React            = require('react'),
      mui              = require('material-ui'),

      Tabs             = mui.Tabs,
      Tab              = mui.Tab,

      CountriesActions = require('../../actions/CountriesActions'),
      CountriesStore   = require('../../stores/CountriesStore'),

      CountryForm      = require('../countries/CountryForm.jsx'),
      CountriesList    = require('../countries/CountriesList.jsx');

class CountriesApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.isRequired
    };

    state = {
        activeTab:       0,
        countries:       [],
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
        CountriesStore.addChangeListener(this._onChange);

        // Load entities
        CountriesActions.load();
    }

    componentWillUnmount() {
        CountriesStore.removeChangeListener(this._onChange);
    }

    _onTabChange(tab) {
        this.setState({
            activeTab:       tab.props.tabIndex,
            selectedCountry: {}
        });
    }

    _onChange() {
        this.setState({
            countries:       CountriesStore.getAll(),
            selectedCountry: {}
        });
    }

    _onDelete(e) {
        CountriesActions.delete(e.currentTarget.dataset.id);
    }

    _onEdit(e) {
        const id = e.currentTarget.dataset.id;

        this.setState({
            selectedCountry: _.findWhere(this.state.countries, {_id: id})
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
                {this.props.leagues.map((league, index) => {
                    const countriesItems = this.state.countries.filter(country => country.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <div>
                                <CountryForm
                                    country={this.state.selectedCountry}
                                    leagueId={league._id}
                                    onCancel={this._onCancel}/>
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

module.exports = CountriesApp;
