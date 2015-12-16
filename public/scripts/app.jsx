import Immutable from 'immutable';
import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router';
import { createHistory } from 'history';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppRoutes from './routes.jsx';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from './reducer';

import LeaguesActions from './actions/LeaguesActions';

import Perf from 'react-addons-perf';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.Perf = Perf;

const logger = createLogger({
    duration:          true,
    predicate:         () => process.env.NODE_ENV !== `production`,
    actionTransformer: action => {
        let newAction = {};

        for (let i of Object.keys(action)) {
            newAction[i] = JSON.stringify(action[i]);
        }

        return newAction;
    },
    stateTransformer:  state => {
        if (Immutable.Map.isMap(state) || Immutable.List.isList(state)) {
            state = state.toJS();
        }

        return state;
    }
});

const history                   = createHistory();
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);
const store                     = createStoreWithMiddleware(reducer);

store.dispatch(LeaguesActions.fetch());

render(
    <Provider store={store}>
        <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
            {AppRoutes}
        </Router>
    </Provider>, document.getElementById('app-content')
);