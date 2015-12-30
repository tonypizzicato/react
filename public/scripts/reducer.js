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

import { GAMES_FETCH, GAMES_FETCH_SUCCESS, GAMES_FETCH_FAILURE } from './actions/GamesActions';

import { GAME_ARTICLES_FETCH, GAME_ARTICLES_FETCH_SUCCESS, GAME_ARTICLES_FETCH_FAILURE } from './actions/GameArticlesActions';
import { GAME_ARTICLES_ADD, GAME_ARTICLES_ADD_SUCCESS, GAME_ARTICLES_ADD_FAILURE } from './actions/GameArticlesActions';
import { GAME_ARTICLES_SAVE, GAME_ARTICLES_SAVE_SUCCESS, GAME_ARTICLES_SAVE_FAILURE } from './actions/GameArticlesActions';
import { GAME_ARTICLES_REMOVE, GAME_ARTICLES_REMOVE_SUCCESS, GAME_ARTICLES_REMOVE_FAILURE } from './actions/GameArticlesActions';

import { PHOTOS_FETCH, PHOTOS_FETCH_SUCCESS, PHOTOS_FETCH_FAILURE } from './actions/PhotosActions';
import { PHOTOS_SAVE, PHOTOS_SAVE_SUCCESS, PHOTOS_SAVE_FAILURE } from './actions/PhotosActions';
import { PHOTOS_REMOVE, PHOTOS_REMOVE_SUCCESS, PHOTOS_REMOVE_FAILURE } from './actions/PhotosActions';

import { NEWS_FETCH, NEWS_FETCH_SUCCESS, NEWS_FETCH_FAILURE } from './actions/NewsActions';
import { NEWS_ADD, NEWS_ADD_SUCCESS, NEWS_ADD_FAILURE } from './actions/NewsActions';
import { NEWS_SAVE, NEWS_SAVE_SUCCESS, NEWS_SAVE_FAILURE } from './actions/NewsActions';
import { NEWS_REMOVE, NEWS_REMOVE_SUCCESS, NEWS_REMOVE_FAILURE } from './actions/NewsActions';

import { FIELDS_FETCH, FIELDS_FETCH_SUCCESS, FIELDS_FETCH_FAILURE } from './actions/FieldsActions';
import { FIELDS_ADD, FIELDS_ADD_SUCCESS, FIELDS_ADD_FAILURE } from './actions/FieldsActions';
import { FIELDS_SAVE, FIELDS_SAVE_SUCCESS, FIELDS_SAVE_FAILURE } from './actions/FieldsActions';
import { FIELDS_REMOVE, FIELDS_REMOVE_SUCCESS, FIELDS_REMOVE_FAILURE } from './actions/FieldsActions';

import { CONTACTS_FETCH, CONTACTS_FETCH_SUCCESS, CONTACTS_FETCH_FAILURE } from './actions/ContactsActions';
import { CONTACTS_ADD, CONTACTS_ADD_SUCCESS, CONTACTS_ADD_FAILURE } from './actions/ContactsActions';
import { CONTACTS_SAVE, CONTACTS_SAVE_SUCCESS, CONTACTS_SAVE_FAILURE } from './actions/ContactsActions';
import { CONTACTS_REMOVE, CONTACTS_REMOVE_SUCCESS, CONTACTS_REMOVE_FAILURE } from './actions/ContactsActions';

import { USERS_FETCH, USERS_FETCH_SUCCESS, USERS_FETCH_FAILURE } from './actions/UsersActions';

import { ORDERS_FETCH, ORDERS_FETCH_SUCCESS, ORDERS_FETCH_FAILURE } from './actions/OrdersActions';

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
    games:           Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    gameArticles:    Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    photos:          Map({
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
    contacts:        Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    users:           Map({
        isFetching: false,
        error:      null,
        items:      List()
    }),
    orders:          Map({
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
    return state.merge({
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

        games: handleActions({
            [GAMES_FETCH]:         (state, action) => state.set('isFetching', true),
            [GAMES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('games'))(state.get('games'), action),

        gameArticles: handleActions({
            [GAME_ARTICLES_FETCH]:         (state, action) => state.set('isFetching', true),
            [GAME_ARTICLES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('gameArticles'))(state.get('gameArticles'), action),

        photos: handleActions({
            [PHOTOS_FETCH]:         (state, action) => state.set('isFetching', true),
            [PHOTOS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('photos'))(state.get('photos'), action),

        news: handleActions({
            [NEWS_FETCH]:         (state, action) => state.set('isFetching', true),
            [NEWS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('news'))(state.get('news'), action),

        fields: handleActions({
            [FIELDS_FETCH]:         (state, action) => state.set('isFetching', true),
            [FIELDS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('fields'))(state.get('fields'), action),

        contacts: handleActions({
            [CONTACTS_FETCH]:         (state, action) => state.set('isFetching', true),
            [CONTACTS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('contacts'))(state.get('contacts'), action),

        users: handleActions({
            [USERS_FETCH]:         (state, action) => state.set('isFetching', true),
            [USERS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('users'))(state.get('users'), action),

        orders: handleActions({
            [ORDERS_FETCH]:         (state, action) => state.set('isFetching', true),
            [ORDERS_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('orders'))(state.get('orders'), action),

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

            [GAMES_FETCH]: state => state + 1,

            [GAME_ARTICLES_FETCH]:  state => state + 1,
            [GAME_ARTICLES_ADD]:    state => state + 1,
            [GAME_ARTICLES_SAVE]:   state => state + 1,
            [GAME_ARTICLES_REMOVE]: state => state + 1,

            [PHOTOS_FETCH]:  state => state + 1,
            [PHOTOS_SAVE]:   state => state + 1,
            [PHOTOS_REMOVE]: state => state + 1,

            [NEWS_FETCH]:  state => state + 1,
            [NEWS_ADD]:    state => state + 1,
            [NEWS_SAVE]:   state => state + 1,
            [NEWS_REMOVE]: state => state + 1,

            [FIELDS_FETCH]:  state => state + 1,
            [FIELDS_ADD]:    state => state + 1,
            [FIELDS_SAVE]:   state => state + 1,
            [FIELDS_REMOVE]: state => state + 1,

            [CONTACTS_FETCH]:  state => state + 1,
            [CONTACTS_ADD]:    state => state + 1,
            [CONTACTS_SAVE]:   state => state + 1,
            [CONTACTS_REMOVE]: state => state + 1,

            [USERS_FETCH]: state => state + 1,

            [ORDERS_FETCH]: state => state + 1,

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

            [GAMES_FETCH_SUCCESS]: state => state - 1,
            [GAMES_FETCH_FAILURE]: state => state - 1,

            [GAME_ARTICLES_FETCH_SUCCESS]:  state => state - 1,
            [GAME_ARTICLES_FETCH_FAILURE]:  state => state - 1,
            [GAME_ARTICLES_ADD_SUCCESS]:    state => state - 1,
            [GAME_ARTICLES_ADD_FAILURE]:    state => state - 1,
            [GAME_ARTICLES_SAVE_SUCCESS]:   state => state - 1,
            [GAME_ARTICLES_SAVE_FAILURE]:   state => state - 1,
            [GAME_ARTICLES_REMOVE_SUCCESS]: state => state - 1,
            [GAME_ARTICLES_REMOVE_FAILURE]: state => state - 1,

            [PHOTOS_FETCH_SUCCESS]:  state => state - 1,
            [PHOTOS_FETCH_FAILURE]:  state => state - 1,
            [PHOTOS_SAVE_SUCCESS]:   state => state - 1,
            [PHOTOS_SAVE_FAILURE]:   state => state - 1,
            [PHOTOS_REMOVE_SUCCESS]: state => state - 1,
            [PHOTOS_REMOVE_FAILURE]: state => state - 1,

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
            [FIELDS_REMOVE_FAILURE]: state => state - 1,

            [CONTACTS_FETCH_SUCCESS]:  state => state - 1,
            [CONTACTS_FETCH_FAILURE]:  state => state - 1,
            [CONTACTS_ADD_SUCCESS]:    state => state - 1,
            [CONTACTS_ADD_FAILURE]:    state => state - 1,
            [CONTACTS_SAVE_SUCCESS]:   state => state - 1,
            [CONTACTS_SAVE_FAILURE]:   state => state - 1,
            [CONTACTS_REMOVE_SUCCESS]: state => state - 1,
            [CONTACTS_REMOVE_FAILURE]: state => state - 1,

            [USERS_FETCH_SUCCESS]: state => state - 1,
            [USERS_FETCH_FAILURE]: state => state - 1,

            [ORDERS_FETCH_SUCCESS]: state => state - 1,
            [ORDERS_FETCH_FAILURE]: state => state - 1

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

            [GAMES_FETCH_FAILURE]: (state, action) => action.payload,

            [GAME_ARTICLES_FETCH_FAILURE]:  (state, action) => action.payload,
            [GAME_ARTICLES_ADD_FAILURE]:    (state, action) => action.payload,
            [GAME_ARTICLES_SAVE_FAILURE]:   (state, action) => action.payload,
            [GAME_ARTICLES_REMOVE_FAILURE]: (state, action) => action.payload,

            [PHOTOS_FETCH_FAILURE]:  (state, action) => action.payload,
            [PHOTOS_SAVE_FAILURE]:   (state, action) => action.payload,
            [PHOTOS_REMOVE_FAILURE]: (state, action) => action.payload,

            [NEWS_FETCH_FAILURE]:  (state, action) => action.payload,
            [NEWS_ADD_FAILURE]:    (state, action) => action.payload,
            [NEWS_SAVE_FAILURE]:   (state, action) => action.payload,
            [NEWS_REMOVE_FAILURE]: (state, action) => action.payload,

            [FIELDS_FETCH_FAILURE]:  (state, action) => action.payload,
            [FIELDS_ADD_FAILURE]:    (state, action) => action.payload,
            [FIELDS_SAVE_FAILURE]:   (state, action) => action.payload,
            [FIELDS_REMOVE_FAILURE]: (state, action) => action.payload,

            [CONTACTS_FETCH_FAILURE]:  (state, action) => action.payload,
            [CONTACTS_ADD_FAILURE]:    (state, action) => action.payload,
            [CONTACTS_SAVE_FAILURE]:   (state, action) => action.payload,
            [CONTACTS_REMOVE_FAILURE]: (state, action) => action.payload,

            [USERS_FETCH_FAILURE]: (state, action) => action.payload,

            [ORDERS_FETCH_FAILURE]: (state, action) => action.payload,

            [UI_ERROR_HANDLED]: (state, action) => null
        }, state.get('lastServerError'))(state.get('lastServerError'), action)
    });
};