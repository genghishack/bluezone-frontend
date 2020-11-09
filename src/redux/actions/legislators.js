import {SET_LEGISLATORS, SET_LEGISLATORS_BY_STATE} from "./actionTypes";

export const setLegislators = (payload) => {
  return {type: SET_LEGISLATORS, payload};
}

export const setLegislatorsByState = (payload) => {
  return {type: SET_LEGISLATORS_BY_STATE, payload};
}
