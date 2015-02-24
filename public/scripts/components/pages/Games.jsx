"ues strict";

var React            = require('react'),
    mui              = require('material-ui'),

    Paper            = mui.Paper,
    Tabs             = mui.Tabs,
    Tab              = mui.Tab,
    Toolbar          = mui.Toolbar,
    ToolbarGroup     = mui.ToolbarGroup,
    DropDownMenu     = mui.DropDownMenu,

    CountriesStore   = require('../../stores/CountriesStore'),
    CountriesActions = require('../../actions/CountriesActions');

var GamesApp = React.createClass({

    getInitialState: function () {
        return {
            countries: []
        }
    },

    componentDidMount: function () {
        CountriesStore.addChangeListener(this._countriesChange);

        CountriesActions.load();
    },

    componentWillUnmount: function () {
        CountriesStore.removeChangeListener(this._countriesChange);
    },

    _countriesChange: function () {
        this.setState({countries: CountriesStore.getAll()});
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {
            var tournaments = this.state.countries.map(function (item) {
                return {_id: item._id, text: item.name};
            }.bind(this));
            var tab;
            if (tournaments.length) {
                tab = (
                    <Toolbar>
                        <ToolbarGroup key={0} float="left">
                            <DropDownMenu menuItems={tournaments} />
                            <span className="mui-toolbar-separator">&nbsp;</span>
                        </ToolbarGroup>
                    </Toolbar>
                );
            } else {
                tab = (
                    <div>No data to edit</div>
                )
            }

            return (<Tab label={league.name} key={league._id}>{tab}</Tab>);
        }.bind(this));

        return (
            <Tabs>{tabItems}</Tabs>
        );
    }
});

module.exports = GamesApp;