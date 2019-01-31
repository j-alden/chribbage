import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
//import classNames from 'classnames';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Actions
import { resetGame } from '../actions/index';

const styles = theme => ({
  button: {
    marginTop: '10px'
  }
});

const onClick = values => {
  resetGame();
};

const ResetGameButton = props => {
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
      <Button className={classes.button} color='primary' onClick={onClick}>
        Start Over
      </Button>
    </div>
  );
};

ResetGameButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  null,
  { resetGame }
)(withStyles(styles)(ResetGameButton));
