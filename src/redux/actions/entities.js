import * as types from './actionTypes';

export function setCurrentEntity(payload) {
  return {type: types.SET_CURRENT_ENTITY, payload: payload};
}

export function menuTreeClick(bool) {
  return {type: types.SET_MENU_TREE_VISIBLE, payload: bool };
}