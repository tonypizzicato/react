import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const LEAGUES_FETCH         = 'LEAGUES_FETCH';
export const LEAGUES_FETCH_SUCCESS = 'LEAGUES_FETCH_SUCCESS';
export const LEAGUES_FETCH_FAILURE = 'LEAGUES_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [LEAGUES_FETCH, LEAGUES_FETCH_SUCCESS, LEAGUES_FETCH_FAILURE],
            endpoint: API.getRoute('leagues:fetch').path,
            method:   API.getRoute('leagues:fetch').method
        }
    }
}

export const LEAGUES_SAVE         = 'LEAGUES_SAVE';
export const LEAGUES_SAVE_SUCCESS = 'LEAGUES_SAVE_SUCCESS';
export const LEAGUES_SAVE_FAILURE = 'LEAGUES_SAVE_FAILURE';

function save(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [LEAGUES_SAVE, LEAGUES_SAVE_SUCCESS, LEAGUES_SAVE_FAILURE],
            endpoint: API.getRoute('leagues:save', data).path,
            method:   API.getRoute('leagues:save', data).method
        }
    }
}

export default {
    fetch,
    save
};