import {combineReducers} from 'redux';
import errors from './errors';
import entities from "./entities";
import states from './states';
import legislators from "./legislators";

const rootReducer = combineReducers({
  errors,
  entities,
  states,
  legislators,
});

export default rootReducer;