import { TOAST_DASH_MESSAGE, TOAST_DASH_CLEAR } from '../actions/types';

const initialState = {
  dash: {
    message: {
      message: '',
      success: undefined
    },
    open: false
  }
};
export default (state = initialState, action) => {
  switch (action.type) {
    case TOAST_DASH_MESSAGE:
      return {
        ...state,
        dash: {
          message: action.payload,
          open: true
        }
      };
    case TOAST_DASH_CLEAR:
      return {
        ...state,
        dash: {
          message: {
            message: '',
            success: undefined
          },
          open: false
        }
      };
    default:
      return state;
  }
};
