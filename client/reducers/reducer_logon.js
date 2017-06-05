import { GET_LOGON, RECEIVED_LOGON } from '../actions/index';

const INITIAL_STATE = { userID: null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case GET_LOGON:
      return state;
    case RECEIVED_LOGON:
      return {...state, userID: action.payload};
    default:
      return state;
  }
}
