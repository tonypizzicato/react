import {createAction} from 'redux-actions';

import { routes, basePath } from '../utils/api-routes';
import api from '../utils/api';
import { API_CALL } from '../middleware/fetchMiddleware';

const API = api.init(routes, basePath);

export const ORDERS_FETCH         = 'ORDERS_FETCH';
export const ORDERS_FETCH_SUCCESS = 'ORDERS_FETCH_SUCCESS';
export const ORDERS_FETCH_FAILURE = 'ORDERS_FETCH_FAILURE';

function fetch() {
    return {
        [API_CALL]: {
            types:    [ORDERS_FETCH, ORDERS_FETCH_SUCCESS, ORDERS_FETCH_FAILURE],
            endpoint: API.getRoute('orders:fetch').path,
            method:   API.getRoute('orders:fetch').method
        }
    }
}
export default {
    fetch
};