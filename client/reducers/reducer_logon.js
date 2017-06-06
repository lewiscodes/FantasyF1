import { GET_LOGON, RECEIVED_LOGON, ERROR_LOGON } from '../actions/index';

const INITIAL_STATE = { userID: null, logonError: false};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case GET_LOGON:
      return state;
    case RECEIVED_LOGON:
      return {...state, userID: action.payload.UserID, logonError: false};
    case ERROR_LOGON:
      return {...state, userID: null, logonError: true};
    default:
      return state;
  }
}
