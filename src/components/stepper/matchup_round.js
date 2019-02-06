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
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
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
    float: 'left',
    margin: '5px',
    marginBottom: '0px',
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#FFEBE6' //theme.palette.secondary.light[50]
    }
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.light,
    paddingLeft: theme.spacing.unit * 0.75,
    paddingRight: theme.spacing.unit * 0.75,
    paddingTop: theme.spacing.unit * 0.5,
    paddingBottom: theme.spacing.unit * 0.5
  },
  cardContent: {
    padding: theme.spacing.unit * 0.75,
    paddingBottom: 0,
    height: '55px'
  },
  title: {
    color: theme.palette.primary.contrastText
  },
  matchupLeft: {
    float: 'left',
    marginRight: theme.spacing.unit * 1
  },
  matchupRight: {
    float: 'right',
    marginLeft: theme.spacing.unit * 1
  },
  matchupsWrapper: {
    float: 'left',
    width: '100%'
  },
  unplayedMatchups: {
    float: 'left',
    //backgroundColor: '#DEEBFF',
    padding: theme.spacing.unit * 1,
    width: '100%'
  },
  playedMatchups: {
    float: 'left',
    padding: theme.spacing.unit * 1,
    width: '100%'
    //backgroundColor: '#EBECF0'
  },
  divider: {
    clear: 'both'
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

// Render player name and score in card content
const renderMatchup = (matchup, classes) => {
  return _.map(matchup, function(player, key) {
    return (
      <div key={key}>
        <Typography>
          <span className={classes.matchupLeft}>{player.name}</span>
          <span className={classes.matchupRight}>{player.score}</span>
          <br />
        </Typography>
      </div>
    );
  });
};

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
    let unplayedMatchups = {};
    let playedMatchups = {};

    // Separate into matches played and not played
    _.map(matchupsObject, (matchup, key) => {
      if (Number(matchup.matchPlayed) === 0) {
        unplayedMatchups[key] = matchup;
      } else playedMatchups[key] = matchup;
    });
    if (_.isEmpty(matchups)) {
      return <div>Loading...</div>;
    }

    return (
      <div className={classes.matchupsWrapper}>
        <div className={classes.unplayedMatchups}>
          <Typography variant='subtitle2'>Unplayed Matches</Typography>
          {_.map(unplayedMatchups, (matchup, key) => {
            return (
              <Card
                key={key}
                className={classes.card}
                onClick={() => this.handleClickOpen(matchup.players, key)}
              >
                <CardHeader
                  className={classes.cardHeader}
                  title={
                    <Typography className={classes.title}>
                      <span className={classes.matchupLeft}>Player</span>
                      <span className={classes.matchupRight}>Score</span>
                    </Typography>
                  }
                />
                <CardContent className={classes.cardContent}>
                  {renderMatchup(matchup.players, classes)}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Divider className={classes.divider} />
        <div className={classes.playedMatchups}>
          <Typography variant='subtitle2'>Played Matches</Typography>
          {_.map(playedMatchups, (matchup, key) => {
            return (
              <Card
                key={key}
                className={classes.card}
                onClick={() => this.handleClickOpen(matchup.players, key)}
              >
                <CardHeader
                  className={classes.cardHeader}
                  title={
                    <Typography className={classes.title}>
                      <span className={classes.matchupLeft}>Player</span>
                      <span className={classes.matchupRight}>Score</span>
                    </Typography>
                  }
                />
                <CardContent className={classes.cardContent}>
                  {renderMatchup(matchup.players, classes)}
                </CardContent>
              </Card>
            );
          })}

          {/* {_.map(matchupsObject, (matchup, key) => {
          return (
            <Card
              key={key}
              className={classes.card}
              onClick={() => this.handleClickOpen(matchup.players, key)}
              //onClick={() => this.handleClickOpen(matchup.players, key)}
            >
              <CardHeader
                className={classes.cardHeader}
                title={
                  <Typography className={classes.title}>
                    <span className={classes.matchupLeft}>Player</span>
                    <span className={classes.matchupRight}>Score</span>
                  </Typography>
                }
              />
              <CardContent className={classes.cardContent}>
                {//renderMatchup(matchup.players, classes)
                renderMatchup(matchup.players, classes)}
              </CardContent>
            </Card>
          );
        })} */}
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
