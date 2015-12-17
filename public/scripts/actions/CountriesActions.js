import {createAction} from 'redux-actions';
import CountriesConstants from '../constants/CountriesConstants';

import { routes } from '../utils/api-routes';
import { API_CALL } from '../middleware/fetchMiddleware';

export const COUNTRIES_FETCH         = 'COUNTRIES_FETCH';
export const COUNTRIES_FETCH_SUCCESS = 'COUNTRIES_FETCH_SUCCESS';
export const COUNTRIES_FETCH_FAILURE = 'COUNTRIES_FETCH_FAILURE';


console.log(routes);

function fetch() {
    return {
        [API_CALL]: {
            types:    [COUNTRIES_FETCH, COUNTRIES_FETCH_SUCCESS, COUNTRIES_FETCH_FAILURE],
            endpoint: routes.countries.list.path,
            method:   routes.countries.list.method
        }
    }
}

export default {
    fetch
};


//"use strict";
//
//var AppDispatcher      = require('../dispatcher/app-dispatcher'),
//    CountriesConstants = require('../constants/CountriesConstants');
//
//var CountriesActions = {
//    load: function () {
//        AppDispatcher.dispatch({
//            type: CountriesConstants.COUNTRIES_LOAD
//        });
//    },
//
//    add: function (data) {
//        AppDispatcher.dispatch({
//            type: CountriesConstants.COUNTRIES_ADD,
//            data: data
//        })
//    },
//
//    save: function (data) {
//        AppDispatcher.dispatch({
//            type: CountriesConstants.COUNTRIES_SAVE,
//            data: data
//        })
//    },
//
//    delete: function (id) {
//        AppDispatcher.dispatch({
//            type: CountriesConstants.COUNTRIES_DELETE,
//            data: {
//                _id: id
//            }
//        });
//    }
//};
//
//module.exports = CountriesActions;
