import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const CONTACTS_FETCH         = 'CONTACTS_FETCH';
export const CONTACTS_FETCH_SUCCESS = 'CONTACTS_FETCH_SUCCESS';
export const CONTACTS_FETCH_FAILURE = 'CONTACTS_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [CONTACTS_FETCH, CONTACTS_FETCH_SUCCESS, CONTACTS_FETCH_FAILURE],
            endpoint: API.getRoute('contacts:fetch').path,
            method:   API.getRoute('contacts:fetch').method
        }
    }
}

export const CONTACTS_ADD         = 'CONTACTS_ADD';
export const CONTACTS_ADD_SUCCESS = 'CONTACTS_ADD_SUCCESS';
export const CONTACTS_ADD_FAILURE = 'CONTACTS_ADD_FAILURE';

function add(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [CONTACTS_ADD, CONTACTS_ADD_SUCCESS, CONTACTS_ADD_FAILURE],
            endpoint: API.getRoute('contacts:add').path,
            method:   API.getRoute('contacts:add').method
        }
    }
}

export const CONTACTS_SAVE         = 'CONTACTS_SAVE';
export const CONTACTS_SAVE_SUCCESS = 'CONTACTS_SAVE_SUCCESS';
export const CONTACTS_SAVE_FAILURE = 'CONTACTS_SAVE_FAILURE';

function save(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [CONTACTS_SAVE, CONTACTS_SAVE_SUCCESS, CONTACTS_SAVE_FAILURE],
            endpoint: API.getRoute('contacts:save', data).path,
            method:   API.getRoute('contacts:save', data).method
        }
    }
}

export const CONTACTS_REMOVE         = 'CONTACTS_REMOVE';
export const CONTACTS_REMOVE_SUCCESS = 'CONTACTS_REMOVE_SUCCESS';
export const CONTACTS_REMOVE_FAILURE = 'CONTACTS_REMOVE_FAILURE';

function remove(id) {
    return {
        payload:    id,
        [API_CALL]: {
            types:    [CONTACTS_REMOVE, CONTACTS_REMOVE_SUCCESS, CONTACTS_REMOVE_FAILURE],
            endpoint: API.getRoute('contacts:remove', {_id: id}).path,
            method:   API.getRoute('contacts:remove', {_id: id}).method
        }
    }
}

export default {
    fetch,
    add,
    save,
    remove
};