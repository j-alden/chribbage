import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';

// Stepper components
import EnterPlayerForm from './enter_player';
import MatchupRound from './matchup_round';
import DisplayWinner from './winner';

//Actions
import { getSettings, getPlayers } from '../../actions/index';

const styles = theme => ({
  root: {
    marginTop: 80,
    margin: -10
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  stepper: {
    borderRadius: 4
  }
});

function getSteps() {
  return [
    'Add Players to Tournament',
    'Matchups: Round 1',
    'Matchups: Round 2',
    'Matchups: Round 3',
    'Matchups: Round 4',
    'Matchups: Round 5',
    'Final Results'
  ];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      //return 'Select campaign settings...';
      return (
        <div>
          <EnterPlayerForm />
        </div>
      );
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return (
        <div>
          {/* Pass in current round as props */}
          <MatchupRound currentRound={stepIndex} />
        </div>
      );
    case 6:
      return (
        <div>
          <DisplayWinner />
        </div>
      );
    default:
      return 'Loading...';
  }
}

class RoundStepper extends Component {
  componentDidMount() {
    this.props.getSettings();
    this.props.getPlayers();
  }
  render() {
    const { classes, currentRound } = this.props;
    const steps = getSteps();

    return (
      <div className={classes.root}>
        <Stepper
          activeStep={currentRound}
          orientation='vertical'
          className={classes.stepper}
        >
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>
                  <Typography variant='h5'>{label}</Typography>
                  {/* <span className={classes.steplabel}>{label}</span> */}
                </StepLabel>
                <StepContent>
                  <Typography component={'span'}>
                    {getStepContent(currentRound)}
                  </Typography>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </div>
    );
  }
}

RoundStepper.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    currentRound: state.settings.currentRound
  };
}

export default connect(
  mapStateToProps,
  { getSettings, getPlayers }
)(withStyles(styles)(RoundStepper));
