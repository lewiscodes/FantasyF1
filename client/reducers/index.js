import { combineReducers } from 'redux';
import LogonReducer from './reducer_logon';

const rootReducer = combineReducers({
  logonReducer: LogonReducer
});

export default rootReducer;
