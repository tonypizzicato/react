import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const COUNTRIES_FETCH         = 'COUNTRIES_FETCH';
export const COUNTRIES_FETCH_SUCCESS = 'COUNTRIES_FETCH_SUCCESS';
export const COUNTRIES_FETCH_FAILURE = 'COUNTRIES_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [COUNTRIES_FETCH, COUNTRIES_FETCH_SUCCESS, COUNTRIES_FETCH_FAILURE],
            endpoint: API.getRoute('countries:list').path,
            method:   API.getRoute('countries:list').method
        }
    }
}

export const COUNTRIES_ADD         = 'COUNTRIES_ADD';
export const COUNTRIES_ADD_SUCCESS = 'COUNTRIES_ADD_SUCCESS';
export const COUNTRIES_ADD_FAILURE = 'COUNTRIES_ADD_FAILURE';

function add(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [COUNTRIES_ADD, COUNTRIES_ADD_SUCCESS, COUNTRIES_ADD_FAILURE],
            endpoint: API.getRoute('countries:add').path,
            method:   API.getRoute('countries:add').method
        }
    }
}

export const COUNTRIES_SAVE         = 'COUNTRIES_SAVE';
export const COUNTRIES_SAVE_SUCCESS = 'COUNTRIES_SAVE_SUCCESS';
export const COUNTRIES_SAVE_FAILURE = 'COUNTRIES_SAVE_FAILURE';

function save(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [COUNTRIES_SAVE, COUNTRIES_SAVE_SUCCESS, COUNTRIES_SAVE_FAILURE],
            endpoint: API.getRoute('countries:save', data).path,
            method:   API.getRoute('countries:save', data).method
        }
    }
}

export const COUNTRIES_REMOVE         = 'COUNTRIES_REMOVE';
export const COUNTRIES_REMOVE_SUCCESS = 'COUNTRIES_REMOVE_SUCCESS';
export const COUNTRIES_REMOVE_FAILURE = 'COUNTRIES_REMOVE_FAILURE';

function remove(id) {
    return {
        payload:    id,
        [API_CALL]: {
            types:    [COUNTRIES_REMOVE, COUNTRIES_REMOVE_SUCCESS, COUNTRIES_REMOVE_FAILURE],
            endpoint: API.getRoute('countries:remove', {_id: id}).path,
            method:   API.getRoute('countries:remove', {_id: id}).method
        }
    }
}

export default {
    fetch,
    add,
    save,
    remove
};