import * as types from './actionTypes';

export function setError(payload) {
  return {type: types.SET_ERROR, payload: payload};
}
