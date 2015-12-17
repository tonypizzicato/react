import React from 'react';
import { render } from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { ReduxRouter, reduxReactRouter } from 'redux-router';

import thunkMiddleware from 'redux-thunk';
import createLogger from './utils/createLogger';

import reducer from './reducer';

import routes from './routes.jsx';

import LeaguesActions from './actions/LeaguesActions';

import Perf from 'react-addons-perf';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.Perf = Perf;

const store = compose(
    applyMiddleware(thunkMiddleware, createLogger()),
    reduxReactRouter({
        routes,
        createHistory,
        routerStateSelector: state => state.get('router')
    })
)(createStore)(reducer);

store.dispatch(LeaguesActions.fetch());

render(
    <Provider store={store}>
        <ReduxRouter routes={routes}/>
    </Provider>,
    document.getElementById('app-content'),
    () => document.body.removeChild(document.getElementById('pre-react'))
);
