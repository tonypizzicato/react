import _ from 'lodash';
import Immutable, {Map, List} from 'immutable';

import routerStateReducer from 'redux-router/lib/routerStateReducer';
import { handleActions } from 'redux-actions';

import { LEAGUES_FETCH, LEAGUES_FETCH_SUCCESS, LEAGUES_FETCH_FAILURE, LEAGUES_SAVE, LEAGUES_SAVE_SUCCESS, LEAGUES_SAVE_FAILURE } from './actions/LeaguesActions';

import { COUNTRIES_FETCH, COUNTRIES_FETCH_SUCCESS, COUNTRIES_FETCH_FAILURE } from './actions/CountriesActions';
import { COUNTRIES_SAVE, COUNTRIES_SAVE_SUCCESS, COUNTRIES_SAVE_FAILURE } from './actions/CountriesActions';
import { COUNTRIES_ADD, COUNTRIES_ADD_SUCCESS, COUNTRIES_ADD_FAILURE } from './actions/CountriesActions';
import { COUNTRIES_REMOVE, COUNTRIES_REMOVE_SUCCESS, COUNTRIES_REMOVE_FAILURE } from './actions/CountriesActions';

import { CATEGORIES_FETCH, CATEGORIES_FETCH_SUCCESS, CATEGORIES_FETCH_FAILURE } from './actions/CategoriesActions';
import { CATEGORIES_ADD, CATEGORIES_ADD_SUCCESS, CATEGORIES_ADD_FAILURE } from './actions/CategoriesActions';
import { CATEGORIES_SAVE, CATEGORIES_SAVE_SUCCESS, CATEGORIES_SAVE_FAILURE } from './actions/CategoriesActions';
import { CATEGORIES_REMOVE, CATEGORIES_REMOVE_SUCCESS, CATEGORIES_REMOVE_FAILURE } from './actions/CategoriesActions';

import { TOURNAMENTS_FETCH, TOURNAMENTS_FETCH_SUCCESS, TOURNAMENTS_FETCH_FAILURE } from './actions/TournamentsActions';
import { TOURNAMENTS_ADD, TOURNAMENTS_ADD_SUCCESS, TOURNAMENTS_ADD_FAILURE } from './actions/TournamentsActions';
import { TOURNAMENTS_SAVE, TOURNAMENTS_SAVE_SUCCESS, TOURNAMENTS_SAVE_FAILURE } from './actions/TournamentsActions';

import { NEWS_FETCH, NEWS_FETCH_SUCCESS, NEWS_FETCH_FAILURE } from './actions/NewsActions';
import { NEWS_ADD, NEWS_ADD_SUCCESS, NEWS_ADD_FAILURE } from './actions/NewsActions';
import { NEWS_SAVE, NEWS_SAVE_SUCCESS, NEWS_SAVE_FAILURE } from './actions/NewsActions';
import { NEWS_REMOVE, NEWS_REMOVE_SUCCESS, NEWS_REMOVE_FAILURE } from './actions/NewsActions';

import { FIELDS_FETCH, FIELDS_FETCH_SUCCESS, FIELDS_FETCH_FAILURE } from './actions/FieldsActions';
import { FIELDS_ADD, FIELDS_ADD_SUCCESS, FIELDS_ADD_FAILURE } from './actions/FieldsActions';
import { FIELDS_SAVE, FIELDS_SAVE_SUCCESS, FIELDS_SAVE_FAILURE } from './actions/FieldsActions';
import { FIELDS_REMOVE, FIELDS_REMOVE_SUCCESS, FIELDS_REMOVE_FAILURE } from './actions/FieldsActions';

import { UI_ERROR_HANDLED } from './actions/UiActions';

/**
 * Default state tree - Immutable object
 */
const INITIAL_STATE = Map({
    router:          {routes: [], params: {}, location: {query: {q: ''}}, components: []},
    leagues:         Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    countries:       Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    tournaments:     Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    categories:      Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    news:            Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    fields:          Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    isFetching:      false,
    lastServerError: null,
    fetchesCount:    0
});

/**
 * Root state reducer
 *
 * @param {Object} state prevState
 * @param {Object} action Action object
 * @returns {Object} nextState
 */
export default (state = INITIAL_STATE, action) => {
    return Map({
        router: routerStateReducer(state.get('router'), action),

        leagues: handleActions({
            [LEAGUES_FETCH]:         (state, action) => state.set('isFetching', true),
            [LEAGUES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('leagues'))(state.get('leagues'), action),

        countries: handleActions({
            [COUNTRIES_FETCH]:         (state, action) => state.merge({'isFetching': true}),
            [COUNTRIES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('countries'))(state.get('countries'), action),

        categories: handleActions({
            [CATEGORIES_FETCH]:         (state, action) => state.set('isFetching', true),
            [CATEGORIES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('categories'))(state.get('categories'), action),

        tournaments: handleActions({
            [TOURNAMENTS_FETCH]:         (state, action) => state.set('isFetching', true),
            [TOURNAMENTS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('tournaments'))(state.get('tournaments'), action),

        news: handleActions({
            [NEWS_FETCH]:         (state, action) => state.set('isFetching', true),
            [NEWS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('news'))(state.get('news'), action),

        fields: handleActions({
            [FIELDS_FETCH]:         (state, action) => state.set('isFetching', true),
            [FIELDS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('fields'))(state.get('fields'), action),

        fetchesCount: handleActions({
            [LEAGUES_FETCH]: state => state + 1,
            [LEAGUES_SAVE]:  state => state + 1,

            [COUNTRIES_FETCH]:  state => state + 1,
            [COUNTRIES_ADD]:    state => state + 1,
            [COUNTRIES_SAVE]:   state => state + 1,
            [COUNTRIES_REMOVE]: state => state + 1,

            [CATEGORIES_FETCH]:  state => state + 1,
            [CATEGORIES_ADD]:    state => state + 1,
            [CATEGORIES_SAVE]:   state => state + 1,
            [CATEGORIES_REMOVE]: state => state + 1,

            [TOURNAMENTS_FETCH]: state => state + 1,
            [TOURNAMENTS_ADD]:   state => state + 1,
            [TOURNAMENTS_SAVE]:  state => state + 1,

            [NEWS_FETCH]:  state => state + 1,
            [NEWS_ADD]:    state => state + 1,
            [NEWS_SAVE]:   state => state + 1,
            [NEWS_REMOVE]: state => state + 1,

            [FIELDS_FETCH]:  state => state + 1,
            [FIELDS_ADD]:    state => state + 1,
            [FIELDS_SAVE]:   state => state + 1,
            [FIELDS_REMOVE]: state => state + 1,

            [LEAGUES_FETCH_SUCCESS]: state => state - 1,
            [LEAGUES_FETCH_FAILURE]: state => state - 1,
            [LEAGUES_SAVE_SUCCESS]:  state => state - 1,
            [LEAGUES_SAVE_FAILURE]:  state => state - 1,

            [COUNTRIES_FETCH_SUCCESS]:  state => state - 1,
            [COUNTRIES_FETCH_FAILURE]:  state => state - 1,
            [COUNTRIES_ADD_SUCCESS]:    state => state - 1,
            [COUNTRIES_ADD_FAILURE]:    state => state - 1,
            [COUNTRIES_SAVE_SUCCESS]:   state => state - 1,
            [COUNTRIES_SAVE_FAILURE]:   state => state - 1,
            [COUNTRIES_REMOVE_SUCCESS]: state => state - 1,
            [COUNTRIES_REMOVE_FAILURE]: state => state - 1,

            [CATEGORIES_FETCH_SUCCESS]:  state => state - 1,
            [CATEGORIES_FETCH_FAILURE]:  state => state - 1,
            [CATEGORIES_ADD_SUCCESS]:    state => state - 1,
            [CATEGORIES_ADD_FAILURE]:    state => state - 1,
            [CATEGORIES_SAVE_SUCCESS]:   state => state - 1,
            [CATEGORIES_SAVE_FAILURE]:   state => state - 1,
            [CATEGORIES_REMOVE_SUCCESS]: state => state - 1,
            [CATEGORIES_REMOVE_FAILURE]: state => state - 1,

            [TOURNAMENTS_FETCH_SUCCESS]: state => state - 1,
            [TOURNAMENTS_FETCH_FAILURE]: state => state - 1,
            [TOURNAMENTS_ADD_SUCCESS]:   state => state - 1,
            [TOURNAMENTS_ADD_FAILURE]:   state => state - 1,
            [TOURNAMENTS_SAVE_SUCCESS]:  state => state - 1,
            [TOURNAMENTS_SAVE_FAILURE]:  state => state - 1,

            [NEWS_FETCH_SUCCESS]:  state => state - 1,
            [NEWS_FETCH_FAILURE]:  state => state - 1,
            [NEWS_ADD_SUCCESS]:    state => state - 1,
            [NEWS_ADD_FAILURE]:    state => state - 1,
            [NEWS_SAVE_SUCCESS]:   state => state - 1,
            [NEWS_SAVE_FAILURE]:   state => state - 1,
            [NEWS_REMOVE_SUCCESS]: state => state - 1,
            [NEWS_REMOVE_FAILURE]: state => state - 1,

            [FIELDS_FETCH_SUCCESS]:  state => state - 1,
            [FIELDS_FETCH_FAILURE]:  state => state - 1,
            [FIELDS_ADD_SUCCESS]:    state => state - 1,
            [FIELDS_ADD_FAILURE]:    state => state - 1,
            [FIELDS_SAVE_SUCCESS]:   state => state - 1,
            [FIELDS_SAVE_FAILURE]:   state => state - 1,
            [FIELDS_REMOVE_SUCCESS]: state => state - 1,
            [FIELDS_REMOVE_FAILURE]: state => state - 1

        }, state.get('fetchesCount'))(state.get('fetchesCount'), action),

        lastServerError: handleActions({
            [LEAGUES_FETCH_FAILURE]: (state, action) => action.payload,
            [LEAGUES_SAVE_FAILURE]:  (state, action) => action.payload,

            [COUNTRIES_FETCH_FAILURE]:  (state, action) => action.payload,
            [COUNTRIES_ADD_FAILURE]:    (state, action) => action.payload,
            [COUNTRIES_SAVE_FAILURE]:   (state, action) => action.payload,
            [COUNTRIES_REMOVE_FAILURE]: (state, action) => action.payload,

            [CATEGORIES_FETCH_FAILURE]:  (state, action) => action.payload,
            [CATEGORIES_ADD_FAILURE]:    (state, action) => action.payload,
            [CATEGORIES_SAVE_FAILURE]:   (state, action) => action.payload,
            [CATEGORIES_REMOVE_FAILURE]: (state, action) => action.payload,

            [TOURNAMENTS_FETCH_FAILURE]: (state, action) => action.payload,
            [TOURNAMENTS_ADD_FAILURE]:   (state, action) => action.payload,
            [TOURNAMENTS_SAVE_FAILURE]:  (state, action) => action.payload,

            [NEWS_FETCH_FAILURE]:  (state, action) => action.payload,
            [NEWS_ADD_FAILURE]:    (state, action) => action.payload,
            [NEWS_SAVE_FAILURE]:   (state, action) => action.payload,
            [NEWS_REMOVE_FAILURE]: (state, action) => action.payload,

            [FIELDS_FETCH_FAILURE]:  (state, action) => action.payload,
            [FIELDS_ADD_FAILURE]:    (state, action) => action.payload,
            [FIELDS_SAVE_FAILURE]:   (state, action) => action.payload,
            [FIELDS_REMOVE_FAILURE]: (state, action) => action.payload,

            [UI_ERROR_HANDLED]: (state, action) => null
        }, state.get('lastServerError'))(state.get('lastServerError'), action)
    });
};