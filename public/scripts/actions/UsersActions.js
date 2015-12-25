import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const USERS_FETCH         = 'USERS_FETCH';
export const USERS_FETCH_SUCCESS = 'USERS_FETCH_SUCCESS';
export const USERS_FETCH_FAILURE = 'USERS_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [USERS_FETCH, USERS_FETCH_SUCCESS, USERS_FETCH_FAILURE],
            endpoint: API.getRoute('users:fetch').path,
            method:   API.getRoute('users:fetch').method
        }
    }
}
export default {
    fetch
};