import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import TransitionGroup from 'react-addons-css-transition-group';

import Link from 'react-router/lib/Link';

import Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';

import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';

import AccountIcon from 'material-ui/svg-icons/action/account-circle';

import LeftNav from '../LeftNav.jsx';
import Auth from '../Auth.jsx';
import Loader from '../Loader.jsx';

import UiActions from '../../actions/UiActions';
import AuthStore from '../../stores/AuthStore';

const menuItems = [
    { route: 'profile', text: 'Профиль' },
    { type: 'divider' },
    { route: 'leagues', text: 'Лиги' },
    { route: 'countries', text: 'Страны' },
    { route: 'tournaments', text: 'Туриниры' },
    { route: 'games', text: 'Игры' },
    { type: 'divider' },
    { route: 'categories', text: 'Категории' },
    { route: 'news', text: 'Новости' },
    { route: 'fields', text: 'Поля' },
    { type: 'divider' },
    { route: 'users', text: 'Пользователи' },
    { route: 'contacts', text: 'Контакты' },
    { route: 'orders', text: 'Заявки' }
];

class MainApp extends Component {

    state = {
        loading:   true,
        navOpened: false,
        loggedIn:  AuthStore.loggedIn(),
        games:     []
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.lastServerError && nextProps.lastServerError) {
            this.refs["snack"].show();

            _.delay(() => this.props.dispatch(UiActions.errorHandled()), 100);
        }

        /** Delay left nav state change for animation performance */
        if (this.props.location.pathname != nextProps.location.pathname) {
            _.delay(() => this.setState({ navOpened: false }), 100);
        }
    }

    //_authChange() {
    //    this.setState({loggedIn: AuthStore.loggedIn()});
    //}
    //
    //_gamesChange() {
    //    this.setState({games: GamesStore.getAll()});
    //}

    @autobind
    _onLeftIconButtonTouchTap() {
        this.setState({ navOpened: !this.state.navOpened });
    }

    @autobind
    _onNavStateChanged(state) {
        this.setState({ navOpened: state });
    }

    get content() {
        let content;

        if (this.state.loggedIn) {
            content = React.createElement('div', { key: this.props.location.pathname, style: this.getStyles().transitioned },
                this.props.children);
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
                <AppBar
                    onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
                    title={appBarTitle}
                    zDepth={0}
                    showMenuIconButton={true}
                    style={styles.appBar}
                    ref="appBar">
                    <div>
                        <AccountIcon style={styles.login.icon}/>
                        {loginOrOut}
                    </div>
                    <Loader/>
                </AppBar>

                <TransitionGroup style={styles.content}
                                 ref="content"
                                 component="div"
                                 transitionName="page-transition"
                                 transitionAppear={true}
                                 transitionAppearTimeout={1300}
                                 transitionEnterTimeout={1300}
                                 transitionLeaveTimeout={1300}>
                    {this.content}
                </TransitionGroup>

                <LeftNav opened={this.state.navOpened}
                         menuItems={menuItems}
                         onStateChange={this._onNavStateChanged}
                         location={location}
                         history={history}/>

                <Snackbar message="Ууупс! Ошибка на сервере. Сорян." autoHideDuration={2000} ref="snack"/>
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
            content:      {
                position:       'relative',
                height:         '100%',
                width:          '100%',
                maxWidth:       1092,
                minWidth:       840,
                marginLeft:     266,
                perspective:    1200,
                transformStyle: 'preserve-3d',
                paddingTop:     Spacing.desktopKeylineIncrement + Spacing.desktopGutter,
                paddingBottom:  Spacing.desktopKeylineIncrement + Spacing.desktopGutter
            },
            transitioned: {
                backfaceVisibility: 'hidden',
                transform:          'translate3d(0, 0, 0)'
            },
            appBar:       {
                position:   'fixed',
                top:        0,
                zIndex:     1400,
                background: 'rgba(0, 188, 212, .96)'
            },
            footer:       {
                backgroundColor: Colors.grey900,
                textAlign:       'center',
                position:        'absolute',
                left:            0,
                bottom:          0,
                height:          '5em',
                width:           '100%'
            },
            p:            {
                margin:   '0 auto',
                padding:  0,
                color:    Colors.lightWhite,
                maxWidth: 335
            },
            login:        {
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
                    lineHeight:    `${Spacing.desktopKeylineIncrement}px`,
                    fontSize:      Spacing.desktopGutterLess,
                    color:         '#fff'
                }
            }
        };
    }
}

export default connect(state => state.toJS())(MainApp);
