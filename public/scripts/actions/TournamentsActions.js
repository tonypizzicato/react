import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const TOURNAMENTS_FETCH         = 'TOURNAMENTS_FETCH';
export const TOURNAMENTS_FETCH_SUCCESS = 'TOURNAMENTS_FETCH_SUCCESS';
export const TOURNAMENTS_FETCH_FAILURE = 'TOURNAMENTS_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [TOURNAMENTS_FETCH, TOURNAMENTS_FETCH_SUCCESS, TOURNAMENTS_FETCH_FAILURE],
            endpoint: API.getRoute('tournaments:fetch').path,
            method:   API.getRoute('tournaments:fetch').method
        }
    }
}

export const TOURNAMENTS_ADD         = 'TOURNAMENTS_ADD';
export const TOURNAMENTS_ADD_SUCCESS = 'TOURNAMENTS_ADD_SUCCESS';
export const TOURNAMENTS_ADD_FAILURE = 'TOURNAMENTS_ADD_FAILURE';

function add(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [TOURNAMENTS_ADD, TOURNAMENTS_ADD_SUCCESS, TOURNAMENTS_ADD_FAILURE],
            endpoint: API.getRoute('tournaments:add').path,
            method:   API.getRoute('tournaments:add').method
        }
    }
}

export const TOURNAMENTS_SAVE         = 'TOURNAMENTS_SAVE';
export const TOURNAMENTS_SAVE_SUCCESS = 'TOURNAMENTS_SAVE_SUCCESS';
export const TOURNAMENTS_SAVE_FAILURE = 'TOURNAMENTS_SAVE_FAILURE';

function save(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [TOURNAMENTS_SAVE, TOURNAMENTS_SAVE_SUCCESS, TOURNAMENTS_SAVE_FAILURE],
            endpoint: API.getRoute('tournaments:save', data).path,
            method:   API.getRoute('tournaments:save', data).method
        }
    }
}

export default {
    fetch,
    add,
    save
};