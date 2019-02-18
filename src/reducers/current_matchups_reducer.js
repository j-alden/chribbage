import { GET_ROUND_MATCHUPS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ROUND_MATCHUPS:
      return action.payload;
    default:
      return state;
  }
};
