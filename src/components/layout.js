import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// Components
import Topbar from './topbar';
import PlayerTable from './player_table';
import RoundStepper from './stepper/round_stepper';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

function TwoPanel(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Topbar />
      <Grid container spacing={8} alignItems='stretch'>
        <Grid item xs={3}>
          <PlayerTable />
          {/* <Paper className={classes.paper}>
            <SimpleTable />
          </Paper> */}
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.paper}>
            <RoundStepper />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

TwoPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TwoPanel);
