import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import postsReducer from '../reducers/posts';

const appReducer = combineReducers({
  routing: routerReducer,
  posts: postsReducer,
});

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
