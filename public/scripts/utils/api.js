import $ from 'jquery';
import s from 'underscore.string';

const Api = function (optRoutes, optBasePath) {
    this.routes   = optRoutes;
    this.basePath = optBasePath;
};

Api.prototype.call = function (routeName, data, isJson) {
    const route = this.get(routeName, data);
    data        = data || {};

    return $.ajax({
        type:        route.method,
        url:         route.path,
        data:        isJson ? JSON.stringify(data) : data,
        contentType: isJson ? "application/json; charset=utf-8" : undefined
    });
};

const _cachedRoutes = {};

Api.prototype.get = function (routeName, params) {
    if (_cachedRoutes[routeName]) {
        return _cachedRoutes[routeName];
    }

    const parts = routeName.split(':');
    let route   = JSON.parse(JSON.stringify(this.routes));

    for (let part of parts) {
        route = route[part];
        if (!route) {
            throw Error('No existing route for ' + routeName);
        }
    }

    route.path = this.basePath + s.sprintf(route.path, params);

    if (!params) {
        _cachedRoutes[routeName] = route;
    }

    return route;
};

Api.prototype.getRoute = Api.prototype.get;

const apis = {};

function init(routes, basePath) {
    if (!apis.hasOwnProperty(basePath)) {
        apis[basePath] = new Api(routes, basePath);
    }

    return apis[basePath];
};

export default {
    init
}
