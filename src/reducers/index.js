import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// Reducers
import playersReducer from './players_reducer';
import settingsReducer from './settings_reducer';
import matchupsReducer from './matchups_reducer';

const rootReducer = combineReducers({
  players: playersReducer,
  settings: settingsReducer,
  matchups: matchupsReducer,
  form: formReducer
});

export default rootReducer;
