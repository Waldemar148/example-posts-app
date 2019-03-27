import * as api from '../clients/api';

import {
  ADD_POSTS,
} from '../constants/posts';

export function addPosts(posts) {
  return { type: ADD_POSTS, posts };
}

export function loadPosts() {
  return async (dispatch) => {
    let posts;
    try {
      posts = await api.getPosts(this.filterParams);
    } catch (e) {
      return;
    }

    dispatch(addPosts(posts));
  };
}
