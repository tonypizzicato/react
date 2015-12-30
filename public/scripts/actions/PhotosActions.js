import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const PHOTOS_FETCH         = 'PHOTOS_FETCH';
export const PHOTOS_FETCH_SUCCESS = 'PHOTOS_FETCH_SUCCESS';
export const PHOTOS_FETCH_FAILURE = 'PHOTOS_FETCH_FAILURE';

function fetch(type, postId) {
    const data  = {type: type, postId: postId};
    const route = API.getRoute('photos:fetch', data);

    return {
        [API_CALL]: {
            types:    [PHOTOS_FETCH, PHOTOS_FETCH_SUCCESS, PHOTOS_FETCH_FAILURE],
            endpoint: route.path,
            method:   route.method
        }
    }
}

export const PHOTOS_SAVE         = 'PHOTOS_SAVE';
export const PHOTOS_SAVE_SUCCESS = 'PHOTOS_SAVE_SUCCESS';
export const PHOTOS_SAVE_FAILURE = 'PHOTOS_SAVE_FAILURE';

function save(type, postId, id, data) {
    data        = assign({}, {type: type, postId: postId, _id: id}, data);
    const route = API.getRoute('photos:save', data);

    return {
        payload:    data,
        [API_CALL]: {
            types:    [PHOTOS_SAVE, PHOTOS_SAVE_SUCCESS, PHOTOS_SAVE_FAILURE],
            endpoint: route.path,
            method:   route.method
        }
    }
}

export const PHOTOS_REMOVE         = 'PHOTOS_REMOVE';
export const PHOTOS_REMOVE_SUCCESS = 'PHOTOS_REMOVE_SUCCESS';
export const PHOTOS_REMOVE_FAILURE = 'PHOTOS_REMOVE_FAILURE';

function remove(type, postId, id) {
    const data  = {type: type, postId: postId, _id: id}
    const route = API.getRoute('photos:remove', data);

    return {
        payload:    data,
        [API_CALL]: {
            types:    [PHOTOS_REMOVE, PHOTOS_REMOVE_SUCCESS, PHOTOS_REMOVE_FAILURE],
            endpoint: route.path,
            method:   route.method
        }
    }
}

export default {
    fetch,
    save,
    remove
};