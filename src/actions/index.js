// Lodash
import _ from 'lodash';

// Firebase references
import {
  playersRef,
  settingsRef,
  matchupsRef,
  postPlayer,
  deletePlayer,
  setRound,
  setMatchups,
  updateMatchupScores,
  resetPlayers,
  resetMatchups,
  updatePlayerTotal
} from '../services/firebase-service';

// Action Types
import {
  GET_PLAYERS,
  GET_SETTINGS,
  SET_NUMBER_PLAYERS,
  GET_MATCHUPS,
  GET_ROUND_MATCHUPS,
  TOAST_DASH_MESSAGE,
  TOAST_DASH_CLEAR
} from './types';

// Get all entered players
export function getPlayers() {
  return dispatch => {
    // Get players
    playersRef.on('value', snapshot => {
      // Assign players to
      const players = snapshot.val();
      // Set the number of players currently entered
      dispatch(setNumberPlayers(_.size(players)));

      // Converts players into an array and pulls out guid
      // Need to have the key to be able to delete the user (maybe can do that without)
      // Maybe can still use object if I can figure out how to reference that when button is clicked
      // Should do this in player_table
      let playersArray = [];

      for (let player in players) {
        playersArray.push({
          id: player,
          name: player.name,
          score: player.score
        });
      }

      dispatch({
        type: GET_PLAYERS,
        payload: players
      });
    });
  };
}

// Pair together players for a given round
export function pairPlayers(round, playersArray) {
  // Move players into matchupArray as they're paired
  let matchupArray = [];
  while (playersArray.length > 0) {
    let matchup = playersArray
      .sort(function() {
        return 0.5 - Math.random();
      }) // Shuffle array
      .slice(0, 2); // Get first two items
    matchup = _.mapValues(_.keyBy(matchup, 'id')); // Convert to object
    // Set score to 0 for each player
    _.map(matchup, player => {
      _.set(player, 'score', 0);
    });
    // Add matchup to array and set boolean to false
    matchupArray.push({
      players: matchup,
      matchPlayed: 0
    });
    playersArray.splice(0, 2); // Remove pair from player array
  }
  setMatchups(round, matchupArray); // Save matchups to firebase
}

export function getAllMatchups() {
  return async dispatch => {
    // Get matchups
    await matchupsRef.on('value', snapshot => {
      // Assign players to result
      const matchups = snapshot.val();
      dispatch({
        type: GET_MATCHUPS,
        payload: matchups
      });
    });
  };
}

export function getCurrentRoundMatchups(currentRound) {
  return async dispatch => {
    // Get matchups
    await matchupsRef.child(`round${currentRound}`).on('value', snapshot => {
      // Assign players to result
      const currentRoundMatchups = snapshot.val();
      dispatch({
        type: GET_ROUND_MATCHUPS,
        payload: currentRoundMatchups
      });
    });
  };
}

// Number of players entered. Need to be even to start
export function setNumberPlayers(numberPlayers) {
  return dispatch => {
    dispatch({ type: SET_NUMBER_PLAYERS, payload: numberPlayers });
  };
}

// Get global settings for app
export function getSettings() {
  return dispatch => {
    // Get global settings
    settingsRef.on('value', snapshot => {
      // Assign settings to variable
      const settings = snapshot.val();
      dispatch({ type: GET_SETTINGS, payload: settings });
    });
  };
}

// Haveing issues with async call to redux store so switched to below
//
// export function areAllMatchesPlayed(matchups, currentRound) {
//   //console.log(matchups);
//   return dispatch => {
//     let matchHasntPlayed = false;
//     // Looks for any player that has 0 points
//     _.map(matchups, matchup => {
//       if (Number(matchup.matchPlayed) === 0) {
//         matchHasntPlayed = true;
//       }
//     });
//     // Go to next round if all players have points
//     if (!matchHasntPlayed) {
//       nextRound(currentRound);
//     }
//   };
// }

// See if all matches for a round are played.
// If yes, move to next round
export function areAllMatchesPlayed(currentRound) {
  return async dispatch => {
    // Get matchups
    await matchupsRef.child(`round${currentRound}`).on('value', snapshot => {
      // Assign players to result
      let matchHasntPlayed = false;
      const currentRoundMatchups = snapshot.val();

      if (currentRoundMatchups !== null) {
        _.map(currentRoundMatchups, matchup => {
          if (Number(matchup.matchPlayed) === 0) {
            matchHasntPlayed = true;
          }
        });
        // Go to next round if all players have points
        if (!matchHasntPlayed) {
          nextRound(currentRound);
        }
      }
    });
  };
}

// Enter a player to play
export function addPlayer(values, callback) {
  postPlayer(values, duplicate => {
    callback(duplicate);
  });

  //postPlayer(values);
}
// Remove an existing player
export function removePlayer(playerKey) {
  deletePlayer(playerKey);
}
// Move to the next round
export function nextRound(currentRound) {
  setRound(currentRound + 1);
}
// Reset to round zero
export function resetRound() {
  setRound(0);
}

export function resetGame() {
  setRound(0);
  resetPlayers();
  resetMatchups();
}

// Set match score and update player totals
export function setMatchScore(currentRound, matchKey, playerScores) {
  updateMatchupScores(currentRound, matchKey, playerScores);
}

// Reduces player total score by previous amount
export function replaceMatchupScore(playerScores) {
  _.map(playerScores, playerScore => {
    const key = playerScore.id;
    const score = -Math.abs(playerScore.score); // subtract previous score
    updatePlayerTotal(key, score);
  });
}

// Move to next round if all games played
export function checkIfAllMatchesArePlayer(currentRound) {}

// Show toast message
export function ToastDashMessage(success, message) {
  return dispatch => {
    dispatch({
      type: TOAST_DASH_MESSAGE,
      payload: { success: success, message: message }
    });
  };
  // return {
  //   type: TOAST_DASH_MESSAGE,
  //   payload: { success: success, message: message }
  // };
}

// Hide toast message
export function ToastDashClear() {
  return dispatch => {
    dispatch({
      type: TOAST_DASH_CLEAR
    });
  };
}
