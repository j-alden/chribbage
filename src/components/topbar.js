import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ResetRoundButton from './reset_round_button';
import colorlogo from '../assets/card_logo_color.png';
import { theme } from '../theme';

const styles = {
  root: {
    flexGrow: 1,
    position: 'fixed',
    width: '100%'
  },
  img: {
    height: 30,
    margin: theme.spacing.unit * 1
  }
};

function Topbar(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <img src={colorlogo} alt='logo' className={classes.img} />
          <ResetRoundButton />
        </Toolbar>
      </AppBar>
    </div>
  );
}

Topbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Topbar);
