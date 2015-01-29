var React                = require('react'),
    mui                  = require('material-ui'),
    injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


var Canvas   = mui.AppCanvas,
    AppBar   = mui.AppBar,
    LeftNav  = mui.LeftNav,
    MenuItem = mui.MenuItem,
    Paper    = mui.Paper;

var Link = React.createClass({

    getInitialState: function () {
        return {
            value: parseInt(this.props.value)
        }
    },

    _onClick: function (e) {
        e.preventDefault();
        this.setState({value: this.state.value + 10});
    },

    render: function () {
        return (
            <a href={this.props.url} onClick={this._onClick}>{this.props.title} vs {this.state.value}</a>
        )
    }
});


var menuItems = [
    {route: 'get-started', text: 'Get Started'},
    {route: 'css-framework', text: 'CSS Framework'},
    {route: 'components', text: 'Components'},
    {type: MenuItem.Types.SUBHEADER, text: 'Resources'},
    {
        type:    MenuItem.Types.LINK,
        payload: 'https://github.com/callemall/material-ui',
        text:    'GitHub'
    },
];


var App = React.createClass({
    render: function () {
        return (
            <div>
                <Canvas>
                    <AppBar title="Amateurs League Admin App" />
                    <Paper>
                        <LeftNav menuItems={menuItems} />
                    </Paper>

                    <Paper>
                        <h1>Hello from React {this.props.filetype}-file</h1>
                        <Link url="http://yandex.ru" title="Yandex" value="150"/>
                    </Paper>
                </Canvas>
            </div>
        )
    }
});

React.render(
    <App filetype="js"/>,
    document.getElementById('app-content')
);