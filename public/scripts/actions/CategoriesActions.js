import {createAction} from 'redux-actions';
import CategoriesConstants from '../constants/CategoriesConstants';

export default {
    load:   createAction(CategoriesConstants.CATEGORIES_FETCH),
    loaded: createAction(CategoriesConstants.CATEGORIES_FETCH_SUCCESS),
    add:    createAction(CategoriesConstants.CATEGORIES_ADD),
    save:   createAction(CategoriesConstants.CATEGORIES_SAVE),
    delete: createAction(CategoriesConstants.CATEGORIES_DELETE)
};
