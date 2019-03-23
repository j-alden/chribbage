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
    position: 'fixed',
    top: 5,
    right: 0
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

  const env = process.env.NODE_ENV;
  // Only show if in development mode
  if (env === 'development') {
    return (
      <div>
        <Button className={classes.button} onClick={onClick}>
          Reset Round
        </Button>
      </div>
    );
  } else {
    return <></>;
  }
};

ResetRoundButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  null,
  { resetRound }
)(withStyles(styles)(ResetRoundButton));
