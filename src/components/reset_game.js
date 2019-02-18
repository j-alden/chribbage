import React from 'react';

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
  const { classes } = props;

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

export default withStyles(styles)(ResetGameButton);
