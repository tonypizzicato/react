import _ from 'lodash';
import $ from 'jquery';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Link from 'react-router/lib/Link';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import Canvas from 'material-ui/lib/app-canvas';
import AppBar from 'material-ui/lib/app-bar';
import Icon from 'material-ui/lib/font-icon';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import Snackbar from 'material-ui/lib/snackbar';
import Indicator from 'material-ui/lib/refresh-indicator';

import AccountIcon from 'material-ui/lib/svg-icons/action/account-circle';

import FullWidth from '../FullWidth.jsx';
import LeftNav from '../LeftNav.jsx';
import Auth from '../Auth.jsx';
import Loader from '../Loader.jsx';

import UiActions from '../../actions/UiActions';
import AuthStore from '../../stores/AuthStore';

import GamesActions from '../../actions/GamesActions';
import GamesStore from '../../stores/GamesStore';

const menuItems = [
    {route: 'profile', text: 'Профиль'},
    {type: 'divider'},
    {route: 'leagues', text: 'Лиги'},
    {route: 'countries', text: 'Страны'},
    {route: 'tournaments', text: 'Туриниры'},
    {route: 'games', text: 'Игры'},
    {type: 'divider'},
    {route: 'categories', text: 'Категории'},
    {route: 'news', text: 'Новости'},
    {route: 'fields', text: 'Поля'},
    {type: 'divider'},
    {route: 'users', text: 'Пользователи'},
    {route: 'contacts', text: 'Контакты'},
    {route: 'orders', text: 'Заявки'}
];

class MainApp extends Component {

    state = {
        loading:   true,
        navOpened: false,
        loggedIn:  AuthStore.loggedIn(),
        games:     []
    };

    constructor(props) {
        super(props);

        this._authChange  = this._authChange.bind(this);
        this._gamesChange = this._gamesChange.bind(this);

        this._onLeftIconButtonTouchTap = this._onLeftIconButtonTouchTap.bind(this);
        this._onNavStateChanged        = this._onNavStateChanged.bind(this);
    }

    componentDidMount() {
        AuthStore.addChangeListener(this._authChange);
        GamesStore.addChangeListener(this._gamesChange);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this._authChange);
        GamesStore.removeChangeListener(this._gamesChange);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.lastServerError && nextProps.lastServerError) {
            this.refs["snack"].show();

            _.defer(() => this.props.dispatch(UiActions.errorHandled()));
        }
    }

    _authChange() {
        this.setState({loggedIn: AuthStore.loggedIn()});
    }

    _gamesChange() {
        this.setState({games: GamesStore.getAll()});
    }

    _onLeftIconButtonTouchTap() {
        this.setState({navOpened: !this.state.navOpened});
    }

    _onNavStateChanged(state) {
        this.setState({navOpened: state});
    }

    _getContentComponent() {
        let content;

        if (this.state.loggedIn) {
            content = this.props.children;
        } else {
            content = <Auth.Auth />
        }

        return content;
    }

    render() {
        const styles = this.getStyles();

        const { fetchesCount, lastServerError, history, location } = this.props;

        const loginOrOut = this.state.loggedIn ?
            <Link style={styles.login.label} to="logout">Выход</Link> :
            <Link style={styles.login.label} to="login">Вход</Link>;

        const appBarTitle = this.getAppBarTitle();

        return (
            <div>
                <Canvas>
                    <AppBar
                        onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
                        title={appBarTitle}
                        zDepth={0}
                        showMenuIconButton={true}
                        style={styles.appBar}
                        ref="appBar">
                        <div style={styles.login.wrapper}>
                            <AccountIcon style={styles.login.icon}/>
                            {loginOrOut}
                        </div>
                        <Loader active={fetchesCount > 0}/>
                    </AppBar>

                    <div style={styles.content} ref="content">
                        {this._getContentComponent()}
                    </div>

                    <LeftNav opened={this.state.navOpened}
                             menuItems={menuItems}
                             onStateChange={this._onNavStateChanged}
                             location={location}
                             history={history}/>

                    <FullWidth style={styles.footer} ref="footer">
                        <p style={styles.p}>
                            Hand crafted with love by tony.pizzicato.
                        </p>
                    </FullWidth>
                    <Snackbar message="Ууупс! Ошибка на сервере. Сорян." autoHideDuration={2000} ref="snack"/>
                </Canvas>
            </div>
        )
    }

    getAppBarTitle() {
        let appBarTitle = _.result(_(menuItems).find(item => item.route && this.props.history.isActive(item.route)), 'text');

        if (!appBarTitle) {
            appBarTitle = 'amateurs.io';
        }

        return appBarTitle;
    }

    getStyles() {
        return {
            content:  {
                maxWidth:      1092,
                minWidth:      840,
                margin:        '0 auto',
                padding:       Spacing.desktopGutter,
                paddingTop:    Spacing.desktopKeylineIncrement + Spacing.desktopGutter,
                paddingBottom: Spacing.desktopKeylineIncrement + Spacing.desktopGutter
            },
            appBar:   {
                position:   'fixed',
                top:        0,
                zIndex:     1400,
                background: 'rgba(0, 188, 212, .96)'
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
            login:    {
                wrapper: {
                    lineHeight: `${Spacing.desktopKeylineIncrement}px`
                },
                icon:    {
                    verticalAlign: 'top',
                    marginRight:   Spacing.desktopGutterMini,
                    fill:          'white',
                    width:         Spacing.desktopGutterMore,
                    height:        Spacing.desktopKeylineIncrement
                },
                label:   {
                    position:      'relative',
                    textTransform: 'uppercase',
                    fontSize:      Spacing.desktopGutterLess,
                    color:         '#fff'
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
}

export default connect(state => state.toJS())(MainApp);
