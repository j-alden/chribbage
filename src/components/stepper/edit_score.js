import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import PropTypes from 'prop-types';
//import classNames from 'classnames';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Redux Form
import { Field, reduxForm } from 'redux-form';

// Actions
import { setMatchScore } from '../../actions/index';

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

const onSubmit = (values, dispatch, props) => {
  const { currentRound, matchup } = props;
  const matchupKey = Object.keys(matchup)[0]; // Grab matchup object key

  setMatchScore(currentRound, matchupKey, values); // Update score
  props.closeDialog(); // Close dialog
};

const EditScoreForm = props => {
  const {
    // currentRound,
    // classes,
    // numberPlayers,
    // pristine,
    // reset,
    // submitting,
    handleSubmit,
    matchup
  } = props;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      {renderMatchupEdit(matchup)}
      <Button color='primary' onClick={props.closeDialog}>
        Cancel
      </Button>
      <Button type='submit' color='primary'>
        Save
      </Button>
    </form>
  );
};

// Pull players out of matchup and display their name
function renderMatchupEdit(matchup) {
  //const { classes } = this.props;
  return _.map(matchup, (players, key) => {
    return _.map(players, (player, key) => {
      return (
        <div key={key}>
          <Typography>{`${player.name}`}</Typography>
          <Field name={key} component={renderTextField} label='Score' />
        </div>
      );
    });
  });
}

// TO DO: Update this to be useful for this component. Copied from Enter Player
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
      placeholder='Score' //errorText={touched && error}
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

EditScoreForm.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {};
}

export default reduxForm({
  validate, //same as validate: 'validate'
  form: 'EditScoreForm',
  onSubmit: (values, dispatch, props) => {} // Gives me access to props in onSubmit
})(
  connect(
    mapStateToProps,
    {}
  )(withStyles(styles)(EditScoreForm))
);
