import React, { Component } from 'react';
import _ from 'lodash';

// Redux
import { connect } from 'react-redux';

//import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// Actions
import { getPlayers, getSettings } from '../actions/index';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
  // ,
  // table: {
  //   minWidth: 700
  // }
});

class PlayerTable extends Component {
  async componentDidMount() {
    this.props.getPlayers();
    this.props.getSettings();
  }

  render() {
    // Object of player names and scores
    const { players } = this.props;

    // SimpleTable.propTypes = { classes: PropTypes.object.isRequired };

    if (players == null) {
      return (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align='right'>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody />
          </Table>
        </Paper>
      );
    }
    // Convert to array for table
    const playersArray = _.values(players);
    // Order by score descending
    playersArray.sort((a, b) =>
      b.score > a.score ? 1 : a.score > b.score ? -1 : 0
    );
    return (
      // This doesn't work when I switched to component
      // <Paper className={classes.root}>
      // <Table className={classes.table}>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playersArray.map(player => {
              return (
                <TableRow key={player.name}>
                  <TableCell component='th' scope='row'>
                    {player.name}
                  </TableCell>
                  <TableCell align='right'>{player.score}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: state.players.players
  };
}

export default connect(
  mapStateToProps,
  { getPlayers, getSettings }
)(withStyles(styles)(PlayerTable));
