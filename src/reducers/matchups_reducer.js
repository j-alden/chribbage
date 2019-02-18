import { GET_MATCHUPS, GET_ROUND_MATCHUPS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_MATCHUPS:
      return { ...state, allMatchups: action.payload };
    case GET_ROUND_MATCHUPS:
      return { ...state, currentRoundMatchups: action.payload };
    default:
      return state;
  }
};
