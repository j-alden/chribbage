import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
// lodash
import _ from 'lodash';
// Material UI
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Actions
import {
  pairPlayers,
  getMatchups,
  areAllMatchesPlayed
} from '../../actions/index';

import EditScoreForm from './edit_score';

const styles = theme => ({
  // Something for card here
  button: {
    //marginTop: theme.spacing.unit,
    float: 'right'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  card: {
    //minWidth: 200
    width: '30%',
    height: 'auto',
    float: 'left',
    margin: '5px',
    textAlign: 'left',
    cursor: 'pointer'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

// Turn players object into array with id to pass into pairPlayers function
const convertPlayersToArray = (playersObject, keyAs) => {
  const playersArray = _.values(
    _.mapValues(playersObject, (value, key) => {
      value[keyAs] = key;
      return value;
    })
  );
  return playersArray;
};

function renderMatchup(matchup) {
  //const { classes } = this.props;
  //console.log(matchup);
  return _.map(matchup, function(player, key) {
    //return _.map(matchup, function(player, key) {
    return (
      <div key={key}>
        <Typography>{`${player.name}: ${player.score}`}</Typography>
      </div>
    );
  });
}

class MatchupRound extends Component {
  componentDidMount() {
    const { matchups, players, currentRound } = this.props;
    this.props.getMatchups(); // Get all matchups
    // Need to do this here as well otherwise resetting match doesn't work
    if (matchups === false) {
      const playersArray = convertPlayersToArray(players, 'id');
      pairPlayers(currentRound, playersArray);
    }
  }

  // Evaluate when to pair players or move to next round
  componentDidUpdate(prevProps) {
    const { matchups, players, currentRound } = this.props;
    if (matchups !== prevProps.matchups) {
      // If matches exist, check if they're all played
      // If all matches are played it moves to next round
      if ((matchups !== undefined) & (matchups !== false)) {
        this.props.areAllMatchesPlayed(matchups, currentRound);
      }
      // If no matches exist, pair players for the round
      else {
        // Turn players object into array
        const playersArray = convertPlayersToArray(players, 'id');
        // Pair players for round 1
        pairPlayers(currentRound, playersArray);
      }
    }
  }

  state = {
    showModal: false,
    selectedMatchup: null
  };

  handleClickOpen = (matchup, key) => {
    const matchupWithKey = { [key]: matchup }; // Set key of object
    this.setState({ showModal: true, selectedMatchup: matchupWithKey });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  render() {
    const {
      classes,
      matchups,
      currentRound
      // pristine,
      // reset,
      // submitting
    } = this.props;
    const matchupsObject = _.toPlainObject(matchups);

    if (_.isEmpty(matchups)) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        {_.map(
          matchupsObject,
          (matchup, key) => {
            return (
              <Card
                key={key}
                className={classes.card}
                onClick={() => this.handleClickOpen(matchup, key)}
              >
                <CardContent>{renderMatchup(matchup)}</CardContent>
              </Card>
            );
          },
          this
        )}
        <Dialog
          open={this.state.showModal}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Edit Score of Game</DialogTitle>
          <DialogContent>
            <EditScoreForm
              closeDialog={this.handleClose}
              matchup={this.state.selectedMatchup}
              currentRound={currentRound}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

MatchupRound.propTypes = {
  classes: PropTypes.object.isRequired
};

renderMatchup.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { currentRound } = state.settings;
  return {
    players: state.players.players,
    // Use currentRound to determine which matchups for state
    matchups: state.matchups[`round${currentRound}`]
  };
}

export default connect(
  mapStateToProps,
  { getMatchups, areAllMatchesPlayed }
)(withStyles(styles)(MatchupRound));
