var Events = {

    once: function (el, type, callback) {
        var typeArray = type.split(' ');
        var recursiveFunction = function (e) {
            e.target.removeEventListener(e.type, recursiveFunction);
            return callback(e);
        };

        for (var i = typeArray.length - 1; i >= 0; i--) {
            this.on(el, typeArray[i], recursiveFunction);
        }
    },

    // IE8+ Support
    on:   function (el, type, callback) {
        if (el.addEventListener) {
            el.addEventListener(type, callback);
        } else {
            el.attachEvent('on' + type, function () {
                callback.call(el);
            });
        }
    },

    // IE8+ Support
    off:  function (el, type, callback) {
        if (el.removeEventListener) {
            el.removeEventListener(type, callback);
        } else {
            el.detachEvent('on' + type, callback);
        }
    }
};

module.exports = {

    _testSupportedProps:    function (props) {
        var i,
            undefined,
            el = document.createElement('div');

        for (i in props) {
            if (props.hasOwnProperty(i) && el.style[i] !== undefined) {
                return props[i];
            }
        }
    },

    //Returns the correct event name to use
    transitionEndEventName: function () {
        return this._testSupportedProps({
            'transition':       'transitionend',
            'OTransition':      'otransitionend',
            'MozTransition':    'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        });
    },

    animationEndEventName: function () {
        return this._testSupportedProps({
            'animation':         'animationend',
            '-o-animation':      'oAnimationEnd',
            '-moz-animation':    'animationend',
            '-webkit-animation': 'webkitAnimationEnd'
        });
    },

    onTransitionEnd: function (el, callback) {
        var transitionEnd = this.transitionEndEventName();

        Events.once(el, transitionEnd, function () {
            return callback();
        });
    },

    onAnimationEnd: function (el, callback) {
        var animationEnd = this.animationEndEventName();

        Events.once(el, animationEnd, function () {
            return callback();
        });
    }

};