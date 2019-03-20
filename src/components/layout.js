import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

// Components
import Topbar from './topbar';
import PlayerTable from './player_table';
import RoundStepper from './stepper/round_stepper';

function TabContainer(props) {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  tabs: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    position: 'fixed',
    width: '100%',
    overflow: 'hidden',
    marginTop: 40
    //marginTop: 48,
  }
});

class TwoTabsLayout extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    console.log(`You're running in ${process.env.NODE_ENV} mode`);
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.menu} />
        <Topbar />
        <Tabs
          value={value}
          onChange={this.handleChange}
          className={classes.tabs}
        >
          <Tab label='Matchups' />
          <Tab label='Scoreboard' />
        </Tabs>
        {value === 0 && (
          <TabContainer>
            <RoundStepper />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <PlayerTable />
          </TabContainer>
        )}
      </div>
    );
  }
}

TwoTabsLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TwoTabsLayout);
