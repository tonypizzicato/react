const AppDispatcher = require('../dispatcher/app-dispatcher'),
      AuthConstants = require('../constants/AuthConstants');

module.exports = {
    signup (data) {
        AppDispatcher.dispatch({
            type: AuthConstants.AUTH_SIGNUP,
            data: data
        });
    },
    login (email, password) {
        AppDispatcher.dispatch({
            type: AuthConstants.AUTH_LOGIN,
            data: {
                email:    email,
                password: password
            }
        });
    },
    logout () {
        AppDispatcher.dispatch({
            type: AuthConstants.AUTH_LOGOUT
        });
    },
    saveUser(data) {
        AppDispatcher.dispatch({
            type: AuthConstants.USER_SAVE,
            data: data
        });
    }
};
