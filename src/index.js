// React
import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

// Styling
import './index.css';
import { theme } from './theme';

// Reducers
import reducers from './reducers';

// Components
import TwoPanel from './components/layout';

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

const createStoreWithMiddleware = compose(
  applyMiddleware(reduxThunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f //ReduxDevTools
)(createStore);

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <div className='.new'>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <TwoPanel />
      </MuiThemeProvider>
    </div>
  </Provider>,
  // This has to match the class in index.html
  document.querySelector('#root')
);
