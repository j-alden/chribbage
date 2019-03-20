import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
//import classNames from 'classnames';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// Redux Form
import { Field, reduxForm, reset } from 'redux-form'; //want to use 'reset'

// Actions
import {
  addPlayer,
  nextRound,
  ToastDashMessage,
  ToastDashClear
} from '../../actions/index';
import { Typography } from '@material-ui/core';

// Components
import ToastMessage from '../toast_message';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    float: 'left'
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  input: {
    display: 'none'
  },
  addPlayerButton: {
    marginLeft: theme.spacing.unit * 1,
    alignSelf: 'center'
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  playersEntered: {
    color: theme.palette.secondary.main
  }
});

const EnterPlayerForm = props => {
  const {
    currentRound,
    classes,
    numberPlayers,
    handleSubmit,
    toast
    // pristine,
    // reset,
    // submitting
  } = props;

  const onSubmit = (values, dispatch) => {
    addPlayer(values.sevenLetter, duplicate => {
      const { isDuplicate } = duplicate;
      let message;
      // Determine if player is already entered
      if (isDuplicate === true) {
        message = `${values.sevenLetter} is already in the tournament!`;
      } else {
        message = `${values.sevenLetter} added to tournament!.`;
      }
      dispatch(ToastDashMessage(!isDuplicate, message)); // Display toast message
      dispatch(reset('EnterPlayerForm')); // Clear input field
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Typography variant='body1'>
          Add players until you're ready to start the tournament! Must have an
          even number of players to start.
        </Typography>
        <div style={{ display: 'inline-flex' }}>
          <Field
            name='sevenLetter'
            component={renderTextField}
            label='Seven Letter'
          />
          <Button
            type='submit'
            color='primary'
            variant='contained'
            className={classes.addPlayerButton}
          >
            Add Player
          </Button>
        </div>
      </form>
      <div className={classes.actionsContainer}>
        <Typography
          variant='subtitle1'
          gutterBottom
          className={classes.playersEntered}
        >
          Players Entered: {numberPlayers}
        </Typography>
        <Button
          // Can't start game without an even number of players
          disabled={
            numberPlayers % 2 !== 0 ? true : false || numberPlayers === 0
          }
          variant='contained'
          // Go to next round when 'Start Game' is clicked
          // Doesn't work if it's not using a callback function
          onClick={() => {
            nextRound(currentRound);
          }}
          className={classes.button}
        >
          Start Game!
        </Button>
      </div>
      <ToastMessage
        message={toast.dash.message.message}
        success={toast.dash.message.success}
        open={toast.dash.open}
        duration={2500}
        onClose={() => props.ToastDashClear()}
      />
    </div>
  );
};

const renderTextField = props => {
  const {
    input,
    label,
    meta: { touched, error },
    classes,
    ...custom
  } = props;

  return (
    <TextField
      id={`${
        touched && error
          ? 'outlined-error outlined-dense'
          : 'outlined-required outlined-with-placeholder outlined-dense'
      }`}
      //className={classes.textField}
      margin='dense'
      variant='outlined'
      required
      label={label}
      placeholder='Enter your Seven Letter' //errorText={touched && error}
      {...input}
      {...custom}
    />
  );
};

// Part of reduxForm. Called whenever they hit submit as part of reduxForm function below
// Also must be called more often because error messages show as they enter in fields
// function validate(values) {
//   // Always start with empty object
//   const errors = {};

//   // Validate the inputs from 'values'

//   // If title is blank OR if length is less than 3 characters
//   // add a 'title' property to errors object
//   if (!values.sevenLetter) {
//     errors.ticker = 'Enter a 7-Letter!';
//   }

//   // If empty object is returned redux form assumes form is fine to submit
//   return errors;
// }

// TO DO - Not really doing anything
// Have an issue where it validates on every change
const validate = values => {
  const errors = {};

  if (!values.sevenLetter) {
    errors.sevenLetter = 'Enter a 7-Letter!';
  }

  //   const requiredFields = ['sevenLetter'];
  //   requiredFields.forEach(field => {
  //     if (!values[field]) {
  //       errors[field] = 'Required';
  //     }
  //       if (values[field].)
  //   });

  return errors;
};

EnterPlayerForm.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    numberPlayers: state.players.numberPlayers,
    currentRound: state.settings.currentRound,
    toast: state.toast
  };
}

export default reduxForm({
  validate, //same as validate: 'validate'
  form: 'EnterPlayerForm'
})(
  connect(
    mapStateToProps,
    { addPlayer, nextRound, ToastDashMessage, ToastDashClear }
  )(withStyles(styles)(EnterPlayerForm))
);
