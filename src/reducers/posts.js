import { List } from 'immutable';

import * as t from '../constants/posts';

const initialState = Map({
  posts: List(),
});

export default function (state = initialState, action) {
  switch (action.type) {
    case t.ADD_POSTS:
      return state.update('posts', posts => posts.concat(action.posts));
    default:
      return state;
  }
}
