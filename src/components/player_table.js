import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

//import PropTypes from 'prop-types';

// Material UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

// Actions
import {
  getPlayers,
  getSettings,
  removePlayer,
  ToastDashMessage,
  ToastDashClear
} from '../actions/index';

// Components
import ToastMessage from './toast_message';

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'score', numeric: true, disablePadding: false, label: 'Score' }
];

const EnhancedTableHeadStyles = theme => ({
  root: {
    marginTop: 100
  },
  tableHead: {}
});

class EnhancedTableHead extends React.Component {
  render() {
    const {
      //onSelectAllClick,
      order,
      orderBy,
      classes
    } = this.props;

    return (
      <TableHead className={classes.root}>
        <TableRow>
          <TableCell padding='checkbox'>
            {
              // NOTE - Disabled select all
              /* <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            /> */
            }
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                {row.label}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead = withStyles(EnhancedTableHeadStyles)(EnhancedTableHead);

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  //onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
    overflowX: 'auto'
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, selectedKeys } = props;

  const handleDelete = () => {
    removePlayer(selectedKeys);
    props.resetSelection();
    //call function passed down from props to clear selected rows
  };

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color='inherit' variant='subtitle1'>
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant='h6' id='tableTitle'>
            Players
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title='Delete'>
            <IconButton aria-label='Delete'>
              <DeleteIcon onClick={handleDelete} />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton disabled>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    //marginTop: theme.spacing.unit * 3,
    marginTop: 80,
    margin: -10,
    overflowX: 'auto'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  checkbox: {
    //padding: 0,
    margin: 0,
    width: 10 // For some reason this works to make checkbox spacing work
  },
  noPlayers: {
    padding: theme.spacing.unit * 3
  }
});

class PlayerTable extends Component {
  state = {
    order: 'desc',
    orderBy: 'score',
    selected: [],
    selectedKeys: [],
    page: 0,
    rowsPerPage: 5
  };

  componentDidMount() {
    this.props.getPlayers();
  }

  // NOTE - Disabled select all
  // handleSelectAllClick = event => {
  //   if (event.target.checked) {
  //     this.setState(state => ({ selected: state.data.map(n => n.id) }));
  //     //this.setState(state => ({ selected: state.data.map(n => n.id) }));
  //     return;
  //   }
  //   this.setState({ selected: [] });
  // };

  handleClick = (event, id, key) => {
    const { selected, selectedKeys } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let newSelectedKeys = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newSelectedKeys = newSelectedKeys.concat(selectedKeys, key);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedKeys = newSelectedKeys.concat(selectedKeys.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedKeys = newSelectedKeys.concat(selectedKeys.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newSelectedKeys = newSelectedKeys.concat(
        selectedKeys.slice(0, selectedIndex),
        selectedKeys.slice(selectedIndex + 1)
      );
    }
    this.setState({
      selected: newSelected,
      selectedKeys: newSelectedKeys
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleDelete = () => {
    this.setState({
      selected: [],
      selectedKeys: []
    });
    const message = 'Player(s) deleted';
    this.props.ToastDashMessage(true, message);
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const {
      players,
      classes,
      toast,
      //onSelectAllClick,
      currentRound
      //rowCount
    } = this.props;

    const { order, orderBy, selected, selectedKeys } = this.state;
    // const emptyRows =
    //   rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    if (players == null) {
      return (
        <Paper className={classes.root}>
          <Typography variant='h5' className={classes.noPlayers}>
            Enter players in the tournament to start!
          </Typography>
        </Paper>
        // <div>
        //   <p>enter players</p>
        //   <Paper>
        //     <Table>
        //       <TableHead>
        //         <TableRow>
        //           <TableCell>Name</TableCell>
        //           <TableCell align='right'>Score</TableCell>
        //         </TableRow>
        //       </TableHead>
        //       <TableBody />
        //     </Table>
        //   </Paper>
        // </div>
      );
    }

    // Convert to array for table
    //const playersArray = _.values(players);

    const playersArray = _.map(players, (value, key) => ({
      key: key,
      name: value.name,
      score: value.score
    }));
    // Order by score descending
    playersArray.sort((a, b) =>
      b.score > a.score ? 1 : a.score > b.score ? -1 : 0
    );
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedKeys={selectedKeys}
          resetSelection={this.handleDelete}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              //onSelectAllClick={this.handleSelectAllClick}
            />

            <TableBody>
              {playersArray.map((player, id) => {
                const isSelected = this.isSelected(id);
                return (
                  <TableRow
                    hover
                    // Only allow deleting before tournament starts
                    onClick={
                      currentRound === 0
                        ? event => this.handleClick(event, id, player.key)
                        : null
                    }
                    role='checkbox'
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={player.key}
                    selected={isSelected}
                  >
                    <TableCell padding='checkbox' className={classes.checkbox}>
                      {// Only allow deleting before tournament starts
                      currentRound === 0 ? (
                        <Checkbox checked={isSelected} />
                      ) : (
                        <></>
                      )}
                    </TableCell>
                    <TableCell component='th' scope='row' padding='none'>
                      {player.name}
                    </TableCell>
                    <TableCell align='right'>{player.score}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <ToastMessage
          message={toast.dash.message.message}
          success={toast.dash.message.success}
          open={toast.dash.open}
          duration={2500}
          onClose={() => this.props.ToastDashClear()}
        />
      </Paper>
    );
  }
}

PlayerTable.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    players: state.players.players,
    toast: state.toast,
    currentRound: state.settings.currentRound
  };
}

export default connect(
  mapStateToProps,
  {
    getPlayers,
    getSettings,
    removePlayer,
    ToastDashMessage,
    ToastDashClear
  }
)(withStyles(styles)(PlayerTable));
