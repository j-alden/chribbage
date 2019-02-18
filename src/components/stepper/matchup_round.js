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
  getAllMatchups,
  areAllMatchesPlayed,
  getCurrentRoundMatchups
} from '../../actions/index';

import EditScoreForm from './edit_score';
import ReShuffleMatchups from '../reshuffle_matchups';

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
    width: 'auto'
  },
  unplayedMatchups: {
    float: 'left',
    //backgroundColor: '#DEEBFF',
    //padding: theme.spacing.unit * 1,
    width: '100%',
    marginTop: theme.spacing.unit * 1
  },
  playedMatchups: {
    float: 'left',
    paddingTop: theme.spacing.unit * 3,
    width: '100%'
    //backgroundColor: '#EBECF0'
  },
  matchupsHeader: {
    //color: theme.palette.secondary.green
    textAlign: 'center'
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

// const getCurrentRoundMatchups = (currentRound, matchups) => {};

class MatchupRound extends Component {
  async componentDidMount() {
    const { currentRound } = this.props;
    await this.props.getAllMatchups(); // Get all matchups
    await this.props.getCurrentRoundMatchups(currentRound);
  }

  // Evaluate when to pair players or move to next round
  componentDidUpdate(prevProps) {
    const { allMatchups, players, currentRound } = this.props;
    if (allMatchups !== prevProps.allMatchups) {
      if (allMatchups !== undefined) {
        if (allMatchups.currentRoundMatchups === null) {
          // Turn players object into array
          const playersArray = convertPlayersToArray(players, 'id');
          // Pair players
          pairPlayers(currentRound, playersArray);
        } else {
          if (
            allMatchups.currentRoundMatchups !==
              prevProps.allMatchups.currentRoundMatchups ||
            currentRound !== prevProps.currentRound
          ) {
            this.props.areAllMatchesPlayed(currentRound); // Verify matches are played
          }
        }
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
      currentRound,
      players,
      allMatchups
      // pristine,
      // reset,
      // submitting
    } = this.props;
    const matchupsObject = _.toPlainObject(allMatchups.currentRoundMatchups);
    // console.log(allMatchups);
    // console.log(matchupsObject);
    let unplayedMatchups = {};
    let playedMatchups = {};

    // Separate into matches played and not played
    _.map(matchupsObject, (matchup, key) => {
      if (Number(matchup.matchPlayed) === 0) {
        unplayedMatchups[key] = matchup;
      } else playedMatchups[key] = matchup;
    });
    if (allMatchups.currentRoundMatchups === null) {
      return <div>Loading...</div>;
    }

    return (
      <div className={classes.matchupsWrapper}>
        <Typography>
          Select a matchup below to submit a score. Once all of the matches are
          played the next round will automatically start. You can reshuffle all
          the matches if none of them have been played.
        </Typography>
        <div className={classes.unplayedMatchups}>
          <Typography variant='h6' className={classes.matchupsHeader}>
            Unplayed Matches
          </Typography>
          <Divider variant='middle' />
          {_.map(unplayedMatchups, (matchup, key) => {
            return (
              <Card
                key={key}
                className={classes.card}
                onClick={() => this.handleClickOpen(matchup, key)}
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
                  {renderMatchup(matchup.players, classes)}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* <Divider className={classes.divider} /> */}
        <div className={classes.playedMatchups}>
          <Typography variant='h6' className={classes.matchupsHeader}>
            Played Matches
          </Typography>
          <Divider variant='middle' />
          {_.map(playedMatchups, (matchup, key) => {
            return (
              <Card
                key={key}
                className={classes.card}
                onClick={() => this.handleClickOpen(matchup, key)}
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
        <ReShuffleMatchups
          disabled={!_.isEmpty(playedMatchups)}
          players={players}
          currentRound={currentRound}
        />
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
  //const { currentRound } = state.settings;
  return {
    players: state.players.players,
    // Use currentRound to determine which matchups for state
    // matchups: state.matchups[`round${currentRound}`],
    allMatchups: state.matchups
  };
}

export default connect(
  mapStateToProps,
  {
    getAllMatchups,
    getCurrentRoundMatchups,
    areAllMatchesPlayed
  }
)(withStyles(styles)(MatchupRound));
