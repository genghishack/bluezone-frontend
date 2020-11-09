import initialState from './initialState';
import * as actionTypes from '../actions/actionTypes';

export default function entities(state = initialState.entities, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_ENTITY:
      return {
        ...state,
        currentEntity: action.payload.id,
        currentType: action.payload.type
      };
    case actionTypes.SET_MENU_TREE_VISIBLE:
      return {
        ...state,
        showMenuTree: action.payload
      };
    default:
      return state;
  }
}