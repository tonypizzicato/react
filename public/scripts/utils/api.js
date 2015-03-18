"use strict";

var $ = require('jquery'),
    s = require('underscore.string');

var Api = function (optRoutes, optBasePath) {
    this.routes = optRoutes;
    this.basePath = optBasePath;
};

Api.prototype.call = function (routeName, data) {
    var route = this.get(routeName, data);

    return $.ajax({
        type: route.method,
        url:  route.path,
        data: data || {}
    });
};

Api.prototype.get = function (routeName, params) {
    var parts = routeName.split(':'),
        route = JSON.parse(JSON.stringify(this.routes));
    for (var i in parts) {
        route = route[parts[i]];
        if (!route) {
            throw Error('No existing route for ' + routeName);
        }
    }

    route.path = this.basePath + s.sprintf(route.path, params);

    return route;
};

var apis = {};
var init = function (routes, basePath) {
    if (!apis.hasOwnProperty(basePath)) {
        apis[basePath] = new Api(routes, basePath);
    }

    return apis[basePath];
};

module.exports.init = init;
