import _ from 'lodash';
import scroll from 'scroll';

const page = /Firefox/.test(navigator.userAgent) ? document.documentElement : document.body;

function scrollTop() {
    scroll.top(page, 0, {duration: 800, ease: 'outQuad'});
}

export default scrollTop;