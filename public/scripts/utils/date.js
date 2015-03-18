"use strict";

var moment = require('moment-timezone');

var tz     = 'Europe/Moscow',
    format = 'DD-MM-YYYY HH:mm';

module.exports = {
    format: function (date) {
        return moment(date).tz(tz).format(format);
    }
};