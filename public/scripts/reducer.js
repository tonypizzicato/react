import _ from 'lodash';
import Immutable, {Map, List} from 'immutable';

import routerStateReducer from 'redux-router/lib/routerStateReducer';
import { handleActions } from 'redux-actions';

import LeaguesConstants from './constants/LeaguesConstants';
import CategoriesConstants from './constants/CategoriesConstants';

const INITIAL_STATE = Map({
    router:     { routes: [], params: {}, location: {query: {q: ''}}, components: [], },
    leagues:    Map({
        isFetching: false,
        items:      List()
    }),
    categories: Map({
        isFetching: false,
        items:      List()
    })
});

export default (state = INITIAL_STATE, action) => {
    return Map({
        router:  routerStateReducer(state.get('router'), action),
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

        categories: handleActions({
            [CategoriesConstants.CATEGORIES_FETCH]:         (state, action) => state.set('isFetching', true),
            [CategoriesConstants.CATEGORIES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: action.payload})
        }, state.get('categories'))(state.get('categories'), action)
    });
};