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

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  }
});

function getSteps() {
  return [
    'Players Enter',
    'Round 1',
    'Round 2',
    'Round 3',
    'Round 4',
    'Round 5',
    'End Results'
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
      return 'Unknown stepIndex';
  }
}

class RoundStepper extends Component {
  render() {
    const { classes, currentRound } = this.props;
    const steps = getSteps();

    return (
      <div className={classes.root}>
        <Stepper activeStep={currentRound} orientation='vertical'>
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography component={'span'}>
                    {getStepContent(currentRound)}
                  </Typography>
                  <div className={classes.actionsContainer} />
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {/* {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )} */}
      </div>
    );
  }
}

RoundStepper.propTypes = {
  classes: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentRound: state.settings.currentRound
  };
}

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(RoundStepper));
