import initialState from './initialState';
import {SET_LEGISLATORS, SET_LEGISLATORS_BY_STATE} from "../actions/actionTypes";

export default function legislators(state = initialState.legislators, action) {
  switch (action.type) {
    case SET_LEGISLATORS:
      return {
        ...state,
        legislators: action.payload
      };
    case SET_LEGISLATORS_BY_STATE:
      return {
        ...state,
        legislatorsByState: action.payload
      };
    default:
      return state;
  }
}
