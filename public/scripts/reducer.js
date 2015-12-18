import _ from 'lodash';
import Immutable, {Map, List} from 'immutable';

import routerStateReducer from 'redux-router/lib/routerStateReducer';
import { handleActions } from 'redux-actions';

import LeaguesConstants from './constants/LeaguesConstants';
import CategoriesConstants from './constants/CategoriesConstants';
import {COUNTRIES_FETCH, COUNTRIES_FETCH_SUCCESS, COUNTRIES_FETCH_FAILURE} from './actions/CountriesActions';

const INITIAL_STATE = Map({
    router:       {routes: [], params: {}, location: {query: {q: ''}}, components: []},
    leagues:      Map({
        isFetching: false,
        items:      List()
    }),
    countries:    Map({
        isFetching: false,
        items:      List()
    }),
    categories:   Map({
        isFetching: false,
        items:      List()
    }),
    isFetching:   false,
    fetchesCount: 0
});

export default (state = INITIAL_STATE, action) => {
    return Map({
        router: routerStateReducer(state.get('router'), action),

        leagues: handleActions({
            [LeaguesConstants.LEAGUES_FETCH]:         (state, action) => state.set('isFetching', true),
            [LeaguesConstants.LEAGUES_FETCH_SUCCESS]: (state, action) => {
                return state.merge({'isFetching': false, items: action.payload})
            },
            [LeaguesConstants.LEAGUES_SAVE_SUCCESS]:  (state, action) => {
                const idx = state.get('items').findIndex(league => league.get('_id') == action.payload._id);

                return idx == -1 ? state : state.updateIn(['items', idx], league => league.merge(action.payload));
            }
        }, state.get('leagues'))(state.get('leagues'), action),

        countries: handleActions({
            [COUNTRIES_FETCH]:         state => state.set('isFetching'),
            [COUNTRIES_FETCH_SUCCESS]: (state, action) => {
                return state.merge({'isFetching': false, items: action.payload})
            }
        }, state.get('countries'))(state.get('countries'), action),

        categories: handleActions({
            [CategoriesConstants.CATEGORIES_FETCH]:         (state, action) => state.set('isFetching', true),
            [CategoriesConstants.CATEGORIES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('categories'))(state.get('categories'), action),

        fetchesCount: handleActions({
            [LeaguesConstants.LEAGUES_FETCH]:       state => state + 1,
            [CategoriesConstants.CATEGORIES_FETCH]: state => state + 1,
            [COUNTRIES_FETCH]:                      state => state + 1,

            [LeaguesConstants.LEAGUES_FETCH_SUCCESS]:       state => state - 1,
            [CategoriesConstants.CATEGORIES_FETCH_SUCCESS]: state => state - 1,
            [COUNTRIES_FETCH_SUCCESS]:                      state => state - 1
        }, state.get('fetchesCount'))(state.get('fetchesCount'), action)
    });
};