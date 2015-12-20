import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const NEWS_FETCH         = 'NEWS_FETCH';
export const NEWS_FETCH_SUCCESS = 'NEWS_FETCH_SUCCESS';
export const NEWS_FETCH_FAILURE = 'NEWS_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [NEWS_FETCH, NEWS_FETCH_SUCCESS, NEWS_FETCH_FAILURE],
            endpoint: API.getRoute('news:fetch').path,
            method:   API.getRoute('news:fetch').method
        }
    }
}

export const NEWS_ADD         = 'NEWS_ADD';
export const NEWS_ADD_SUCCESS = 'NEWS_ADD_SUCCESS';
export const NEWS_ADD_FAILURE = 'NEWS_ADD_FAILURE';

function add(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [NEWS_ADD, NEWS_ADD_SUCCESS, NEWS_ADD_FAILURE],
            endpoint: API.getRoute('news:add').path,
            method:   API.getRoute('news:add').method
        }
    }
}

export const NEWS_SAVE         = 'NEWS_SAVE';
export const NEWS_SAVE_SUCCESS = 'NEWS_SAVE_SUCCESS';
export const NEWS_SAVE_FAILURE = 'NEWS_SAVE_FAILURE';

function save(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [NEWS_SAVE, NEWS_SAVE_SUCCESS, NEWS_SAVE_FAILURE],
            endpoint: API.getRoute('news:save', data).path,
            method:   API.getRoute('news:save', data).method
        }
    }
}

export const NEWS_REMOVE         = 'NEWS_REMOVE';
export const NEWS_REMOVE_SUCCESS = 'NEWS_REMOVE_SUCCESS';
export const NEWS_REMOVE_FAILURE = 'NEWS_REMOVE_FAILURE';

function remove(id) {
    return {
        payload:    id,
        [API_CALL]: {
            types:    [NEWS_REMOVE, NEWS_REMOVE_SUCCESS, NEWS_REMOVE_FAILURE],
            endpoint: API.getRoute('news:remove', {_id: id}).path,
            method:   API.getRoute('news:remove', {_id: id}).method
        }
    }
}

export default {
    fetch,
    add,
    save,
    remove
};