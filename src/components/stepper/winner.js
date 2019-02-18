import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
// lodash
import _ from 'lodash';
// Material UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// Components
import ResetGameButton from '../reset_game';

const styles = theme => ({
  button: {
    float: 'right'
  }
});

class DisplayWinner extends Component {
  render() {
    const { players } = this.props;
    const playersArray = _.values(players); // Array for sorting

    // Order by score descending
    playersArray.sort((a, b) =>
      b.score > a.score ? 1 : a.score > b.score ? -1 : 0
    );
    const winner = playersArray[0]; // Select winner

    if (winner === null || winner === undefined) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Typography>
          {`${winner.name} is the winner with a score of ${winner.score}!`}
        </Typography>
        <ResetGameButton />
      </div>
    );
  }
}

DisplayWinner.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    players: state.players.players
  };
}

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(DisplayWinner));
