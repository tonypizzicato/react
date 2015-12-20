import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const CATEGORIES_FETCH         = 'CATEGORIES_FETCH';
export const CATEGORIES_FETCH_SUCCESS = 'CATEGORIES_FETCH_SUCCESS';
export const CATEGORIES_FETCH_FAILURE = 'CATEGORIES_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [CATEGORIES_FETCH, CATEGORIES_FETCH_SUCCESS, CATEGORIES_FETCH_FAILURE],
            endpoint: API.getRoute('categories:fetch').path,
            method:   API.getRoute('categories:fetch').method
        }
    }
}

export const CATEGORIES_ADD         = 'CATEGORIES_ADD';
export const CATEGORIES_ADD_SUCCESS = 'CATEGORIES_ADD_SUCCESS';
export const CATEGORIES_ADD_FAILURE = 'CATEGORIES_ADD_FAILURE';

function add(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [CATEGORIES_ADD, CATEGORIES_ADD_SUCCESS, CATEGORIES_ADD_FAILURE],
            endpoint: API.getRoute('categories:add').path,
            method:   API.getRoute('categories:add').method
        }
    }
}

export const CATEGORIES_SAVE         = 'CATEGORIES_SAVE';
export const CATEGORIES_SAVE_SUCCESS = 'CATEGORIES_SAVE_SUCCESS';
export const CATEGORIES_SAVE_FAILURE = 'CATEGORIES_SAVE_FAILURE';

function save(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [CATEGORIES_SAVE, CATEGORIES_SAVE_SUCCESS, CATEGORIES_SAVE_FAILURE],
            endpoint: API.getRoute('categories:save', data).path,
            method:   API.getRoute('categories:save', data).method
        }
    }
}

export const CATEGORIES_REMOVE         = 'CATEGORIES_REMOVE';
export const CATEGORIES_REMOVE_SUCCESS = 'CATEGORIES_REMOVE_SUCCESS';
export const CATEGORIES_REMOVE_FAILURE = 'CATEGORIES_REMOVE_FAILURE';

function remove(id) {
    return {
        payload:    id,
        [API_CALL]: {
            types:    [CATEGORIES_REMOVE, CATEGORIES_REMOVE_SUCCESS, CATEGORIES_REMOVE_FAILURE],
            endpoint: API.getRoute('categories:remove', {_id: id}).path,
            method:   API.getRoute('categories:remove', {_id: id}).method
        }
    }
}

export default {
    fetch,
    add,
    save,
    remove
};