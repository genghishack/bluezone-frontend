import {SET_BBOXES, SET_DISTRICTS_BY_STATE, SET_STATES} from "./actionTypes";

export const setStates = (payload) => {
  return {type: SET_STATES, payload};
}

export const setDistrictsByState = (payload) => {
  return {type: SET_DISTRICTS_BY_STATE, payload};
}

export const setBBoxes = (payload) => {
  return {type: SET_BBOXES, payload};
}