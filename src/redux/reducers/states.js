import initialState from './initialState';
import {SET_BBOXES, SET_DISTRICTS_BY_STATE, SET_STATES} from "../actions/actionTypes";

export default function states(state = initialState.states, action) {
  switch (action.type) {
    case SET_STATES:
      return {
        ...state,
        states: action.payload
      };
    case SET_DISTRICTS_BY_STATE:
      return {
        ...state,
        districtsByState: action.payload
      };
    case SET_BBOXES:
      return {
        ...state,
        bboxes: action.payload
      };
    default:
      return state;
  }
}
