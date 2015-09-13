"use strict";

const _              = require('lodash'),
      React          = require('react'),
      Router         = require('react-router'),
      mui            = require('material-ui'),

      RouteHandler   = Router.RouteHandler,

      Link           = Router.Link,

      Colors         = mui.Styles.Colors,
      Canvas         = mui.AppCanvas,
      AppBar         = mui.AppBar,
      Icon           = mui.FontIcon,

      FullWidth      = require('../FullWidth.jsx'),
      LeftNav        = require('../LeftNav.jsx'),
      Auth           = require('../Auth.jsx').Auth,

      AuthStore      = require('../../stores/AuthStore'),

      LeaguesActions = require('../../actions/LeaguesActions'),
      LeaguesStore   = require('../../stores/LeaguesStore'),
      GamesActions   = require('../../actions/GamesActions'),
      GamesStore     = require('../../stores/GamesStore');


const { Spacing } = mui.Styles;

var menuItems = [
    {route: 'users', text: 'Пользователи'},
    {route: 'leagues', text: 'Лиги'},
    {route: 'countries', text: 'Страны'},
    {route: 'tournaments', text: 'Туриниры'},
    {route: 'categories', text: 'Категории'},
    {route: 'news', text: 'Новости'},
    {route: 'games', text: 'Игры'},
    {route: 'contacts', text: 'Контакты'},
    {route: 'fields', text: 'Поля'},
    {route: 'orders', text: 'Заявки'}
];

var ThemeManager = new mui.Styles.ThemeManager();

var MainApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            loggedIn: AuthStore.loggedIn(),
            leagues:  [],
            games:    []
        }
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function () {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    componentDidMount: function () {
        //this._updatePageHeight();

        AuthStore.addChangeListener(this._authChange);
        LeaguesStore.addChangeListener(this._leaguesChange);
        GamesStore.addChangeListener(this._gamesChange);

        LeaguesActions.load();
    },

    componentWillUnmount: function () {
        AuthStore.removeChangeListener(this._authChange);
        LeaguesStore.removeChangeListener(this._leaguesChange);
        GamesStore.removeChangeListener(this._gamesChange);
    },

    componentDidUpdate: function () {
        //this._updatePageHeight();
    },

    _updatePageHeight: function () {
        const w = window,
              d = document,
              e = d.documentElement,
              g = d.getElementsByTagName('body')[0];

        const content = React.findDOMNode(this.refs.content);
        const appBar  = React.findDOMNode(this.refs.appBar);
        const footer  = React.findDOMNode(this.refs.footer);

        const pageHeight    = w.innerHeight || e.clientHeight || g.clientHeight;
        const appBarHeight  = appBar.clientHeight;
        const contentHeight = content.clientHeight;
        const footerHeight  = footer.clientHeight;

        content.style.height = pageHeight - appBarHeight - footerHeight > contentHeight ? pageHeight - appBarHeight - footerHeight + 'px' : contentHeight;
    },

    _authChange: function () {
        this.setState({loggedIn: AuthStore.loggedIn()});
    },

    _leaguesChange: function () {
        var leagues = LeaguesStore.getAll();
        this.setState({leagues: leagues});
        leagues.forEach(function (league) {
            GamesActions.load({leagueId: league._id});
        });
    },

    _gamesChange: function () {
        this.setState({games: GamesStore.getAll()});
    },

    _onLeftIconButtonTouchTap() {
        this.refs.leftNav.toggle();
    },

    render: function () {
        var styles = this.getStyles();

        var loginOrOut = this.state.loggedIn ?
            <Link to="logout">Выход</Link> :
            <Link to="login">Вход</Link>;

        const appBarTitle = _.result(_(menuItems).find(item => {
            return this.context.router.isActive(item.route);
        }), 'text');

        var content = '';
        if (this.state.loggedIn) {
            content = <RouteHandler leagues={this.state.leagues} games={this.state.games}/>
        } else {
            content = <Auth />
        }

        return (
            <div>
                <Canvas>
                    <AppBar
                        onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
                        title={appBarTitle}
                        zDepth={0}
                        showMenuIconButton={this.state.loggedIn}
                        style={{position: 'absolute', top: 0}}
                        ref="appBar">
                        <div className="login">
                            <Icon className="mdfi_action_account_circle"/>
                            {loginOrOut}
                        </div>
                    </AppBar>

                    <div style={styles.content} ref="content">
                        {content}
                    </div>

                    <LeftNav menuItems={menuItems} ref="leftNav"/>

                    <FullWidth style={styles.footer} ref="footer">
                        <p style={styles.p}>
                            Hand crafted with love by tony.pizzicato.
                        </p>
                    </FullWidth>
                </Canvas>
            </div>
        )
    },

    getStyles: function () {
        return {
            content: {
                padding:       Spacing.desktopGutter,
                paddingTop:    Spacing.desktopKeylineIncrement + Spacing.desktopGutter,
                paddingBottom: Spacing.desktopKeylineIncrement + Spacing.desktopGutter
            },
            footer:  {
                backgroundColor: Colors.grey900,
                textAlign:       'center',
                position:        'absolute',
                left:            '0',
                bottom:          '0',
                height:          '5em',
                width:           '100%'
            },
            p:       {
                margin:   '0 auto',
                padding:  0,
                color:    Colors.lightWhite,
                maxWidth: 335
            }
        };
    }
});

module.exports = MainApp;
