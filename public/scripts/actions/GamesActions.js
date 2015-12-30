import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const GAMES_FETCH         = 'GAMES_FETCH';
export const GAMES_FETCH_SUCCESS = 'GAMES_FETCH_SUCCESS';
export const GAMES_FETCH_FAILURE = 'GAMES_FETCH_FAILURE';

function fetch(data) {
    return {
        payload:    data,
        [API_CALL]: {
            types:    [GAMES_FETCH, GAMES_FETCH_SUCCESS, GAMES_FETCH_FAILURE],
            endpoint: API.getRoute('games:fetch').path,
            method:   API.getRoute('games:fetch').method
        }
    }
}
export default {
    fetch
};