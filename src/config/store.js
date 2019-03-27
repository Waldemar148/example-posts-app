import { browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';

const store = createStore(rootReducer, compose(applyMiddleware(
  thunk,
  routerMiddleware(browserHistory),
)));

export default store;
