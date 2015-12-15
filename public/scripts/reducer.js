import Immutable, {Map, List} from 'immutable';
import {handleActions} from 'redux-actions';

import CategoriesConstants from './constants/CategoriesConstants';

const INITIAL_STATE = Map({
    categories: {
        isFetching: false,
        items:      List()
    }
});

export default (state = INITIAL_STATE, action) => {
    return Map({
        categories: handleActions({
            [CategoriesConstants.CATEGORIES_FETCH]:         (state, action) => state.set('isFetching', true),
            [CategoriesConstants.CATEGORIES_FETCH_SUCCESS]: (state, action) => state.merge({'isFetching': false, items: Immutable.fromJS(action.payload)})
        }, INITIAL_STATE.get('categories'))(state.get('categories'), action)
    });
};