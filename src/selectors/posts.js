import { createSelector } from 'reselect';

const stateSelector = state => state.posts;

export const postsSelector = createSelector(
  stateSelector,
  state => state.get('posts'),
);
