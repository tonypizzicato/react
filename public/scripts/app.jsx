var React                = require('react'),
    Router               = require('react-router'),
    injectTapEventPlugin = require("react-tap-event-plugin"),
    mui                  = require('material-ui'),

    AppRoutes            = require('./routes.jsx');

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

Router.create({
    routes:         AppRoutes,
    scrollBehavior: Router.ScrollToTopBehavior
}).run(function (Handler) {
    React.render(<Handler />, document.getElementById('app-content'));
});