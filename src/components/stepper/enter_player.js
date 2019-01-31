import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
//import classNames from 'classnames';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// Redux Form
import { Field, reduxForm } from 'redux-form'; //want to use 'reset'

// Actions
import { addPlayer, nextRound } from '../../actions/index';

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
  button: {
    marginTop: theme.spacing.unit
  },
  input: {
    display: 'none'
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  }
});

const onSubmit = values => {
  addPlayer(values.sevenLetter, () => {
    // TO DO: Toast message instead of console log
    console.log('Player added!');
    // TO DO: Reset form when player is submitted
    //this.props.dispatch(reset('EnterPlayerForm'));
  });
};

// function handleStartGame(currentRound) =>  {
//   console.log('CurrentRound: ' + currentRound);
//   //nextRound(currentRound);
// }

const EnterPlayerForm = props => {
  const {
    currentRound,
    classes,
    numberPlayers,
    handleSubmit
    // pristine,
    // reset,
    // submitting
  } = props;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <div>
        <Field
          name='sevenLetter'
          component={renderTextField}
          label='Seven Letter'
        />
      </div>
      <div>
        <Button type='submit' className={classes.button}>
          Add Player
        </Button>
      </div>
      <div className={classes.actionsContainer}>
        <Button
          // Can't start game without an even number of players
          disabled={numberPlayers % 2 !== 0 ? true : false}
          color='primary'
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
    </form>
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
    currentRound: state.settings.currentRound
  };
}

export default reduxForm({
  validate, //same as validate: 'validate'
  form: 'EnterPlayerForm'
})(
  connect(
    mapStateToProps,
    { addPlayer, nextRound }
  )(withStyles(styles)(EnterPlayerForm))
);
