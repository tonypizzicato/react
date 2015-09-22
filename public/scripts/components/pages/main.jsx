"use strict";

const _                = require('lodash'),
      $                = require('jquery'),
      React            = require('react'),
      Router           = require('react-router'),
      mui              = require('material-ui'),

      RouteHandler     = Router.RouteHandler,

      Link             = Router.Link,

      Colors           = mui.Styles.Colors,
      Spacing          = mui.Styles.Spacing,

      Canvas           = mui.AppCanvas,
      AppBar           = mui.AppBar,
      Icon             = mui.FontIcon,
      RefreshIndicator = mui.RefreshIndicator,
      Snackbar         = mui.Snackbar,

      FullWidth        = require('../FullWidth.jsx'),
      LeftNav          = require('../LeftNav.jsx'),
      Auth             = require('../Auth.jsx').Auth,

      AuthStore        = require('../../stores/AuthStore'),

      LeaguesActions   = require('../../actions/LeaguesActions'),
      LeaguesStore     = require('../../stores/LeaguesStore'),
      GamesActions     = require('../../actions/GamesActions'),
      GamesStore       = require('../../stores/GamesStore');

const menuItems = [
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

const ThemeManager = new mui.Styles.ThemeManager();

const MainApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            loading:  true,
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
        this._showLoader();

        $(document).ajaxError(this._handleAjaxError);
        $(document).ajaxComplete(this._handleAjaxComplete);

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

    _showLoader: function () {
        this.setState({loading: true});

        _.delay(this.setState.bind(this, {loading: false}), 1000);
    },

    _hideLoader: function () {
        _.delay(this.setState.bind(this, {loading: false}), 400);
    },

    _handleAjaxError: function () {
        this._hideLoader();
        this.refs.snack.show();
        _.delay(this.refs.snack.dismiss, 2000);
    },

    _handleAjaxComplete: function () {
        if (this.state.loading) {
            this._hideLoader();
        }
    },

    _authChange: function () {
        this.setState({loggedIn: AuthStore.loggedIn()});
    },

    _leaguesChange: function () {
        const leagues = LeaguesStore.getAll();
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

    _getContentComponent() {
        let content;

        if (this.state.loggedIn) {
            content = <RouteHandler leagues={this.state.leagues} games={this.state.games}/>
        } else {
            content = <Auth />
        }

        return content;
    },

    render: function () {
        const styles = this.getStyles();

        const loginOrOut = this.state.loggedIn ?
            <Link style={styles.login.label} to="logout">Выход</Link> :
            <Link style={styles.login.label} to="login">Вход</Link>;

        const appBarTitle = _.result(_(menuItems).find(item => {
            return this.context.router.isActive(item.route);
        }), 'text');

        return (
            <div>
                <Canvas>
                    <div style={styles.loader}>
                        <RefreshIndicator
                            left={Spacing.desktopGutterLess}
                            top={Spacing.desktopGutterMini}
                            size={Spacing.desktopGutter * 2}
                            status={this.state.loading ? "loading" : "hide"}
                            ref="loader"/>
                    </div>
                    <AppBar
                        onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
                        title={appBarTitle}
                        zDepth={0}
                        showMenuIconButton={this.state.loggedIn}
                        style={{position: 'fixed', top: 0}}
                        ref="appBar">
                        <div>
                            <Icon style={styles.login.icon} className="mdfi_action_account_circle"/>
                            {loginOrOut}
                        </div>
                    </AppBar>

                    <div style={styles.content} ref="content">
                        {this._getContentComponent()}
                    </div>

                    <LeftNav menuItems={menuItems} ref="leftNav"/>

                    <FullWidth style={styles.footer} ref="footer">
                        <p style={styles.p}>
                            Hand crafted with love by tony.pizzicato.
                        </p>
                    </FullWidth>
                    <Snackbar
                        style={styles.snackbar}
                        message="Ошибка загрузки данных. Попробуйте повторить запрос."
                        ref="snack"/>
                </Canvas>
            </div>
        )
    },

    getStyles: function () {
        return {
            content:  {
                width:         1000,
                margin:        '0 auto',
                padding:       Spacing.desktopGutter,
                paddingTop:    Spacing.desktopKeylineIncrement + Spacing.desktopGutter,
                paddingBottom: Spacing.desktopKeylineIncrement + Spacing.desktopGutter
            },
            footer:   {
                backgroundColor: Colors.grey900,
                textAlign:       'center',
                position:        'absolute',
                left:            0,
                bottom:          0,
                height:          '5em',
                width:           '100%'
            },
            p:        {
                margin:   '0 auto',
                padding:  0,
                color:    Colors.lightWhite,
                maxWidth: 335
            },
            loader:   {
                height:     Spacing.desktopGutterMore * 2,
                width:      Spacing.desktopGutterMore * 2 + Spacing.desktopGutterMore,
                position:   'absolute',
                margin:     '0 auto',
                left:       '50%',
                marginLeft: '-' + Spacing.desktopGutterMore,
                zIndex:     6
            },
            login:    {
                icon:  {
                    position:    'relative',
                    fontSize:    Spacing.desktopGutterMore,
                    top:         Spacing.desktopGutterLess,
                    marginRight: Spacing.desktopGutterMini,
                    color:       'white',
                    zIndex:      5
                },
                label: {
                    position:      'relative',
                    textTransform: 'uppercase',
                    fontSize:      16,
                    color:         '#fff',
                    top:           Spacing.desktopGutterMini
                }
            },
            snackbar: {
                top:         0,
                right:       0,
                left:        'auto',
                marginTop:   Spacing.desktopGutterMini,
                marginRight: Spacing.desktopGutter
            }
        };
    }
});

module.exports = MainApp;
