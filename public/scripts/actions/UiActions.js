import {createAction} from 'redux-actions';

export const UI_ERROR_HANDLED = 'UI_ERROR_HANDLED';

const errorHandled = createAction(UI_ERROR_HANDLED);

export default {
    errorHandled
};