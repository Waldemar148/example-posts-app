import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, push } from 'react-router-redux';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';

import routes from './config/routes';
import store from './config/store';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history} routes={routes} />
    </MuiThemeProvider>
  </Provider>
  document.getElementById('root'),
);
