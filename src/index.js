// React
import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

// Styling
import './index.css';

// Reducers
import reducers from './reducers';

// Components
import TwoPanel from './components/layout';

const createStoreWithMiddleware = compose(
  applyMiddleware(reduxThunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f //ReduxDevTools
)(createStore);

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <div>
      <TwoPanel />
      {/* <Topbar />
      <SimpleTable /> */}
    </div>
  </Provider>,
  // This has to match the class in index.html
  document.querySelector('#root')
);
