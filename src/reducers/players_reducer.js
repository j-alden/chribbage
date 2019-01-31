import { GET_PLAYERS, SET_NUMBER_PLAYERS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_NUMBER_PLAYERS:
      return { ...state, numberPlayers: action.payload };
    case GET_PLAYERS:
      return { ...state, players: action.payload };
    default:
      return state;
  }
};
