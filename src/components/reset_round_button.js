import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
//import classNames from 'classnames';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Actions
import { resetRound } from '../actions/index';

const styles = theme => ({
  button: {
    //marginTop: theme.spacing.unit,
    float: 'right',
    position: 'fixed',
    right: 0,
    top: 5
  }
});

const onClick = values => {
  resetRound();
};

const ResetRoundButton = props => {
  const {
    classes
    // numberPlayers,
    // handleSubmit,
    // pristine,
    // reset,
    // submitting
  } = props;

  return (
    <div>
      <Button className={classes.button} onClick={onClick}>
        Reset Round
      </Button>
    </div>
  );
};

ResetRoundButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  null,
  { resetRound }
)(withStyles(styles)(ResetRoundButton));
