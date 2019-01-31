import * as firebase from 'firebase';
import { FirebaseConfig } from '../config/keys';
import _ from 'lodash';

const devFirebaseConfig = {
  apiKey: 'AIzaSyBy3-clnTXfa11xfmuZWfMJZN61N5-LOxg',
  authDomain: 'chribbage.firebaseapp.com',
  databaseURL: 'https://chribbage.firebaseio.com'
};

//firebase.initializeApp(FirebaseConfig);
firebase.initializeApp(devFirebaseConfig);

const databaseRef = firebase.database().ref();

export const playersRef = databaseRef.child('players');
export const settingsRef = databaseRef.child('settings');
export const matchupsRef = databaseRef.child('matchups');

export function postPlayer(name) {
  var rootRef = firebase.database().ref();
  var playersRef = rootRef.child('players');
  var newPlayerRef = playersRef.push();
  newPlayerRef.set({ name: name, score: 0 });
  return newPlayerRef;
}

export function deletePlayer(playerKey) {
  playersRef.child(playerKey).remove();
}

export function setRound(round) {
  settingsRef.update({ currentRound: round });
}

export function setMatchups(round, matchups) {
  switch (round) {
    case (round = 1):
      return matchupsRef.update({ round1: matchups });
    case (round = 2):
      return matchupsRef.update({ round2: matchups });
    case (round = 3):
      return matchupsRef.update({ round3: matchups });
    case (round = 4):
      return matchupsRef.update({ round4: matchups });
    case (round = 5):
      return matchupsRef.update({ round5: matchups });
    default:
      return null;
  }
}
// Update scores for a single match
export function updateMatchupScores(currentRound, matchKey, playerScores) {
  const matchupRef = databaseRef.child(
    `matchups/round${currentRound}/${matchKey}`
  );
  _.map(playerScores, (playerScore, key) => {
    // Update matchup score
    matchupRef
      .child(`${key}`)
      .update({ score: playerScore })
      .then(updatePlayerTotal(key, playerScore));
  });
}
// Update the total score for a player
export function updatePlayerTotal(playerKey, score) {
  // Get total score for player and upate
  playersRef.child(`${playerKey}`).once('value', snapshot => {
    const currentScore = snapshot.val().score;
    const newScore = +currentScore + +score;
    playersRef.child(`${playerKey}`).update({ score: newScore });
  });
}
// Delete all players
export function resetPlayers() {
  playersRef.remove();
}
// Delete all matchups
export function resetMatchups() {
  const matchups = firebase.database().ref('matchups');

  // Set all rounds to false otherwise I run into errors
  matchups.child('round1').set(false);
  matchups.child('round2').set(false);
  matchups.child('round3').set(false);
  matchups.child('round4').set(false);
  matchups.child('round5').set(false);
}
