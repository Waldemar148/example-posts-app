import React from 'react';
import { Route } from 'react-router';

import App from '../components/App';
import PostsPage from '../components/Posts';

const routes = (
  <Route path="/" component={App}>
    <Route path="posts" component={PostsPage} />
  </Route>
);

export default routes;
