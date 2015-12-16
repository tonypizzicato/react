import {createAction} from 'redux-actions';
import LeaguesConstants from '../constants/LeaguesConstants';

import routes from '../utils/api-routes';
import initApi from '../utils/api';

const api = initApi.init(routes.routes, routes.basePath);

const fetched = createAction(LeaguesConstants.LEAGUES_FETCH_SUCCESS);
const saved   = createAction(LeaguesConstants.LEAGUES_SAVE_SUCCESS, data => data);

const fetch = () => {
    return dispatch => {
        dispatch(createAction(LeaguesConstants.LEAGUES_FETCH)());

        return api.call('leagues:list').done(function (response) {
            dispatch(fetched(response));
        });
    }
};

const save = (data) => {
    return dispatch => {
        dispatch(createAction(LeaguesConstants.LEAGUES_SAVE)());

        api.call('leagues:save', data).then(function () {
            dispatch(saved(data));
        });
    }
};

export default {
    fetch,
    fetched,
    save
};