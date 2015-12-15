import Immutable from 'immutable';
import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router';
import { createHistory } from 'history';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppRoutes from './routes.jsx';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createLogger  from 'redux-logger';

import reducer from './reducer';

import Perf from 'react-addons-perf';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.Perf = Perf;

const logger = createLogger({
    stateTransformer: (state) => {
        let newState = {};

        for (var i of Object.keys(state)) {
            if (Immutable.Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS();
            } else {
                newState[i] = state[i];
            }
        }

        return newState;
    }
});

const history                   = createHistory();
const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
const store                     = createStoreWithMiddleware(reducer);

render(
    <Provider store={store}>
        <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
            {AppRoutes}
        </Router>
    </Provider>, document.getElementById('app-content')
);