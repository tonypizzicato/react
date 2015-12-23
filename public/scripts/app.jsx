import delay from 'lodash/function/delay';
import classList from 'dom-shims/shim/Element.classList';

import React from 'react';
import { render } from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { ReduxRouter, reduxReactRouter } from 'redux-router';

import thunkMiddleware from 'redux-thunk';
import createLogger from './utils/createLogger';
import fetchMiddleware from './middleware/fetchMiddleware';

import reducer from './reducer';

import routes from './routes.jsx';

import LeaguesActions from './actions/LeaguesActions';

import Perf from 'react-addons-perf';

document.getElementById('progress').classList.add('progress_active_yes');

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.Perf = Perf;

const store = compose(
    applyMiddleware(thunkMiddleware, fetchMiddleware),
    reduxReactRouter({
        routes,
        createHistory,
        routerStateSelector: state => state.get('router').toJS()
    })
)(createStore)(reducer);

store.dispatch(LeaguesActions.fetch()).then(() => {
    render(
        <Provider store={store}>
            <ReduxRouter routes={routes}/>
        </Provider>,
        document.getElementById('app-content'),
        () => document.body.removeChild(document.getElementById('pre-react'))
    );

    delay(() => document.getElementById('progress').classList.remove('progress_active_yes'), 15);
    delay(() => document.body.removeChild(document.getElementById('progress')), 500);

    console.log('fetched leagues');
});