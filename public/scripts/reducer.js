import _ from 'lodash';
import Immutable, {Map, List} from 'immutable';
import {handleActions} from 'redux-actions';

import LeaguesConstants from './constants/LeaguesConstants';
import CategoriesConstants from './constants/CategoriesConstants';

const INITIAL_STATE = Map({
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