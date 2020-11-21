import initialState from './initialState';
import * as actionTypes from '../actions/actionTypes';

export default function errors(state = initialState.errors, action) {
  switch (action.type) {
    case actionTypes.SET_ERROR:
      return [
        ...state,
        action.payload
      ];
    default:
      return state;
  }
}