"ues strict";

var _              = require('underscore'),
    React          = require('react'),
    mui            = require('material-ui'),

    Authentication = require('../Auth.jsx').Authentication,

    Tabs           = mui.Tabs,
    Tab            = mui.Tab,

    GamesTab       = require('../games/GamesTab.jsx');


var GamesApp = React.createClass({

    mixins: [Authentication],

    getDefaultProps: function () {
        return {
            leagues: [],
            games:   []
        }
    },

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required,
            games:   React.PropTypes.array.required
        }
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {
            return (
                <Tab label={league.name} onActive={this._onTabChange} key={league._id + '-tab'}>
                    <GamesTab leagueId={league._id} games={this.props.games} key={league._id + '-tab-content'}/>
                </Tab>
            );
        }.bind(this));

        return (
            <Tabs className="s_mb_24">{tabItems}</Tabs>
        );
    }
});

module.exports = GamesApp;
