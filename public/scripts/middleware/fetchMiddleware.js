import createAction from 'redux-actions/lib/createAction';

export const API_CALL = Symbol('API Call');

const API_ROOT = 'http://localhost:9000/api';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error      = new Error(response.statusText)
        error.response = response
        throw error
    }
}

function parseJSON(response) {
    return response.json()
}

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, method = 'get') {
    const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

    return fetch(fullUrl, {method: method})
        .then(checkStatus)
        .then(response => ({json, response: parseJSON(response)}))
        .catch(function (error) {
            console.log('request failed', error)
        });
}


export default store => next => action => {
    const apiCall = action[API_CALL];

    if (typeof apiCall === 'undefined') {
        return next(action)
    }

    let { endpoint, method, types } = apiCall;

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.');
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.');
    }

    const [ requestType, successType, failureType ] = types;

    next(createAction(requestType)());

    return callApi(endpoint, method).then(
        response => next(createAction(successType)(response)),
        error => next(createAction(failureType)(error.message || 'Something bad happened'))
    )

    return true;
}