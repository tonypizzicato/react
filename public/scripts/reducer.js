import _ from 'lodash';
import Immutable, {Map, List} from 'immutable';

import routerStateReducer from 'redux-router/lib/routerStateReducer';
import { handleActions } from 'redux-actions';

import LeaguesConstants from './constants/LeaguesConstants';
import CategoriesConstants from './constants/CategoriesConstants';


import { LEAGUES_FETCH, LEAGUES_FETCH_SUCCESS, LEAGUES_FETCH_FAILURE, LEAGUES_SAVE, LEAGUES_SAVE_SUCCESS, LEAGUES_SAVE_FAILURE } from './actions/LeaguesActions';
import { COUNTRIES_FETCH, COUNTRIES_FETCH_SUCCESS, COUNTRIES_FETCH_FAILURE } from './actions/CountriesActions';
import { COUNTRIES_ADD, COUNTRIES_ADD_SUCCESS, COUNTRIES_ADD_FAILURE } from './actions/CountriesActions';
import { COUNTRIES_REMOVE, COUNTRIES_REMOVE_SUCCESS, COUNTRIES_REMOVE_FAILURE } from './actions/CountriesActions';

import { UI_ERROR_HANDLED } from './actions/UiActions';

const INITIAL_STATE = Map({
    router:          {routes: [], params: {}, location: {query: {q: ''}}, components: []},
    leagues:         Map({
        isFetching: false,
        items:      List()
    }),
    countries:       Map({
        isFetching: false,
        items:      List()
    }),
    categories:      Map({
        isFetching: false,
        items:      List()
    }),
    isFetching:      false,
    lastServerError: null,
    fetchesCount:    0
});

export default (state = INITIAL_STATE, action) => {
    return Map({
        router: routerStateReducer(state.get('router'), action),

        leagues: handleActions({
            [LEAGUES_FETCH]:         (state, action) => state.set('isFetching', true),
            [LEAGUES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload}),
            [LEAGUES_SAVE_SUCCESS]:  (state, action) => {
                const idx = state.get('items').findIndex(league => league.get('_id') == action.payload._id);

                return idx == -1 ? state : state.updateIn(['items', idx], league => league.merge(action.payload));
            }
        }, state.get('leagues'))(state.get('leagues'), action),

        countries: handleActions({
            [COUNTRIES_FETCH]:         (state, action) => state.set('isFetching'),
            [COUNTRIES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('countries'))(state.get('countries'), action),

        categories: handleActions({
            [CategoriesConstants.CATEGORIES_FETCH]:         (state, action) => state.set('isFetching', true),
            [CategoriesConstants.CATEGORIES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('categories'))(state.get('categories'), action),

        fetchesCount: handleActions({
            [LEAGUES_FETCH]:                        state => state + 1,
            [LEAGUES_SAVE]:                         state => state + 1,
            [COUNTRIES_FETCH]:                      state => state + 1,
            [COUNTRIES_ADD]:                        state => state + 1,
            [COUNTRIES_REMOVE]:                     state => state + 1,
            [CategoriesConstants.CATEGORIES_FETCH]: state => state + 1,

            [LEAGUES_FETCH_SUCCESS]:                        state => state - 1,
            [LEAGUES_FETCH_FAILURE]:                        state => state - 1,
            [LEAGUES_SAVE_SUCCESS]:                         state => state - 1,
            [LEAGUES_SAVE_FAILURE]:                         state => state - 1,
            [COUNTRIES_FETCH_SUCCESS]:                      state => state - 1,
            [COUNTRIES_FETCH_FAILURE]:                      state => state - 1,
            [COUNTRIES_ADD_SUCCESS]:                        state => state - 1,
            [COUNTRIES_ADD_FAILURE]:                        state => state - 1,
            [COUNTRIES_REMOVE_SUCCESS]:                     state => state - 1,
            [COUNTRIES_REMOVE_FAILURE]:                     state => state - 1,
            [CategoriesConstants.CATEGORIES_FETCH_SUCCESS]: state => state - 1

        }, state.get('fetchesCount'))(state.get('fetchesCount'), action),

        lastServerError: handleActions({
            [LEAGUES_FETCH_FAILURE]:   (state, action) => action.payload,
            [LEAGUES_SAVE_FAILURE]:    (state, action) => action.payload,
            [COUNTRIES_FETCH_FAILURE]: (state, action) => action.payload,
            [COUNTRIES_ADD_FAILURE]:   (state, action) => action.payload,

            [UI_ERROR_HANDLED]: (state, action) => null
        }, state.get('lastServerError'))(state.get('lastServerError'), action)
    });
};