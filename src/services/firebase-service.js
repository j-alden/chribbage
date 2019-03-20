import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { FirebaseConfig } from '../config/keys';
import _ from 'lodash';
//import { getPlayers } from '../actions';

// const devFirebaseConfig = {
//   apiKey: 'AIzaSyBy3-clnTXfa11xfmuZWfMJZN61N5-LOxg',
//   authDomain: 'chribbage.firebaseapp.com',
//   databaseURL: 'https://chribbage.firebaseio.com'
// };

firebase.initializeApp(FirebaseConfig);
//firebase.initializeApp(devFirebaseConfig);

const databaseRef = firebase.database().ref();
export const playersRef = databaseRef.child('players');
export const settingsRef = databaseRef.child('settings');
export const matchupsRef = databaseRef.child('matchups');

// Add new player
export function postPlayer(name, callback) {
  var duplicate = false;
  playersRef
    .orderByChild('name')
    .equalTo(name)
    .once('value', snapshot => {
      if (snapshot.exists()) {
        duplicate = true;
        callback({ isDuplicate: duplicate });
      } else {
        playersRef.push().set({
          name: name,
          score: 0
        });
        callback({ isDuplicate: duplicate });
      }
    });
  //https://stackoverflow.com/questions/47879534/error-on-then-callback-after-set-data-into-firebase-database-using-node-js
}

// Delete player (not implemented)
export function deletePlayer(playerKey) {
  playersRef.child(playerKey).remove();
}

// Set current round
export function setRound(round) {
  settingsRef.update({ currentRound: round });
}

// Set matchups for given round
export function setMatchups(round, matchups) {
  matchupsRef.update({ [`round${round}`]: matchups });
}

// Set score for a single match
export async function updateMatchupScores(
  currentRound,
  matchKey,
  playerScores
) {
  const matchupRef = await databaseRef.child(
    `matchups/round${currentRound}/${matchKey}`
  );
  matchupRef.update({ matchPlayed: 1 }); // set match to played

  _.map(playerScores, (playerScore, key) => {
    // Update matchup score
    matchupRef
      .child(`players/${key}`)
      .update({ score: playerScore })
      .then(updatePlayerTotal(key, playerScore));
  });
}
// Update the total score for a player
export function updatePlayerTotal(playerKey, score) {
  // Get total score for player and upate
  playersRef.child(`${playerKey}`).once('value', snapshot => {
    if (snapshot.val() !== null) {
      const currentScore = snapshot.val().score;
      const newScore = +currentScore + +score;
      playersRef.child(`${playerKey}`).update({ score: newScore });
    }
  });
}
// Delete all players
export function resetPlayers() {
  playersRef.remove();
}
// Delete all matchups
export function resetMatchups() {
  firebase
    .database()
    .ref('matchups')
    .remove();
}
