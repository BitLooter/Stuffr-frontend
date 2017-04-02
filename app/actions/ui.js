/* Actions relating to the user interface.
******************************************/

import {createAction} from 'redux-actions'

export const AUTHORIZATION_REQUIRED = 'AUTHORIZATION_REQUIRED'
export const authorizationRequired = createAction(AUTHORIZATION_REQUIRED)
