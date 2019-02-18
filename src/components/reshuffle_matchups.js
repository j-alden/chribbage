import React from 'react';

import PropTypes from 'prop-types';
//import classNames from 'classnames';

// Material UInpm
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Actions
import { pairPlayers } from '../actions/index';

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 5
  }
});

const onClick = (currentRound, players) => {
  pairPlayers(currentRound, players);
};

const ReShuffleMatchups = props => {
  const {
    classes,
    players,
    currentRound,
    disabled
    // numberPlayers,
    // handleSubmit,
    // pristine,
    // reset,
    // submitting
  } = props;
  return (
    <div>
      <Button
        disabled={disabled}
        className={classes.button}
        color='primary'
        onClick={() => onClick(currentRound, players)}
      >
        Reshuffle Matchups
      </Button>
    </div>
  );
};

ReShuffleMatchups.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ReShuffleMatchups);
