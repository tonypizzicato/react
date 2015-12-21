import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const FIELDS_FETCH         = 'FIELDS_FETCH';
export const FIELDS_FETCH_SUCCESS = 'FIELDS_FETCH_SUCCESS';
export const FIELDS_FETCH_FAILURE = 'FIELDS_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [FIELDS_FETCH, FIELDS_FETCH_SUCCESS, FIELDS_FETCH_FAILURE],
            endpoint: API.getRoute('fields:fetch').path,
            method:   API.getRoute('fields:fetch').method
        }
    }
}

export const FIELDS_ADD         = 'FIELDS_ADD';
export const FIELDS_ADD_SUCCESS = 'FIELDS_ADD_SUCCESS';
export const FIELDS_ADD_FAILURE = 'FIELDS_ADD_FAILURE';

function add(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [FIELDS_ADD, FIELDS_ADD_SUCCESS, FIELDS_ADD_FAILURE],
            endpoint: API.getRoute('fields:add').path,
            method:   API.getRoute('fields:add').method
        }
    }
}

export const FIELDS_SAVE         = 'FIELDS_SAVE';
export const FIELDS_SAVE_SUCCESS = 'FIELDS_SAVE_SUCCESS';
export const FIELDS_SAVE_FAILURE = 'FIELDS_SAVE_FAILURE';

function save(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [FIELDS_SAVE, FIELDS_SAVE_SUCCESS, FIELDS_SAVE_FAILURE],
            endpoint: API.getRoute('fields:save', data).path,
            method:   API.getRoute('fields:save', data).method
        }
    }
}

export const FIELDS_REMOVE         = 'FIELDS_REMOVE';
export const FIELDS_REMOVE_SUCCESS = 'FIELDS_REMOVE_SUCCESS';
export const FIELDS_REMOVE_FAILURE = 'FIELDS_REMOVE_FAILURE';

function remove(id) {
    return {
        payload:    id,
        [API_CALL]: {
            types:    [FIELDS_REMOVE, FIELDS_REMOVE_SUCCESS, FIELDS_REMOVE_FAILURE],
            endpoint: API.getRoute('fields:remove', {_id: id}).path,
            method:   API.getRoute('fields:remove', {_id: id}).method
        }
    }
}

export default {
    fetch,
    add,
    save,
    remove
};