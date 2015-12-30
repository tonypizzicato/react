import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const GAME_ARTICLES_FETCH         = 'GAME_ARTICLES_FETCH';
export const GAME_ARTICLES_FETCH_SUCCESS = 'GAME_ARTICLES_FETCH_SUCCESS';
export const GAME_ARTICLES_FETCH_FAILURE = 'GAME_ARTICLES_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [GAME_ARTICLES_FETCH, GAME_ARTICLES_FETCH_SUCCESS, GAME_ARTICLES_FETCH_FAILURE],
            endpoint: API.getRoute('gameArticles:fetch').path,
            method:   API.getRoute('gameArticles:fetch').method
        }
    }
}

export const GAME_ARTICLES_ADD         = 'GAME_ARTICLES_ADD';
export const GAME_ARTICLES_ADD_SUCCESS = 'GAME_ARTICLES_ADD_SUCCESS';
export const GAME_ARTICLES_ADD_FAILURE = 'GAME_ARTICLES_ADD_FAILURE';

function add(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [GAME_ARTICLES_ADD, GAME_ARTICLES_ADD_SUCCESS, GAME_ARTICLES_ADD_FAILURE],
            endpoint: API.getRoute('gameArticles:add').path,
            method:   API.getRoute('gameArticles:add').method
        }
    }
}

export const GAME_ARTICLES_SAVE         = 'GAME_ARTICLES_SAVE';
export const GAME_ARTICLES_SAVE_SUCCESS = 'GAME_ARTICLES_SAVE_SUCCESS';
export const GAME_ARTICLES_SAVE_FAILURE = 'GAME_ARTICLES_SAVE_FAILURE';

function save(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [GAME_ARTICLES_SAVE, GAME_ARTICLES_SAVE_SUCCESS, GAME_ARTICLES_SAVE_FAILURE],
            endpoint: API.getRoute('gameArticles:save', data).path,
            method:   API.getRoute('gameArticles:save', data).method
        }
    }
}

export const GAME_ARTICLES_REMOVE         = 'GAME_ARTICLES_REMOVE';
export const GAME_ARTICLES_REMOVE_SUCCESS = 'GAME_ARTICLES_REMOVE_SUCCESS';
export const GAME_ARTICLES_REMOVE_FAILURE = 'GAME_ARTICLES_REMOVE_FAILURE';

function remove(id) {
    return {
        payload:    id,
        [API_CALL]: {
            types:    [GAME_ARTICLES_REMOVE, GAME_ARTICLES_REMOVE_SUCCESS, GAME_ARTICLES_REMOVE_FAILURE],
            endpoint: API.getRoute('gameArticles:remove', {_id: id}).path,
            method:   API.getRoute('gameArticles:remove', {_id: id}).method
        }
    }
}

export default {
    fetch,
    add,
    save,
    remove
};