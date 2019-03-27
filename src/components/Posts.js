import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { List } from 'immutable';

import {
  clearNewPosts,
  loadPosts,
} from '../actions/posts';

import { postsSelector } from '../selectors/posts';

import InfiniteList from './InfiniteList';

import PostItemWrapper from './PostItemWrapper';


class Posts extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      nextPage: 1,
      perPage: 20,
    };
  }

  componentDidMount() {
    this.props.clearNewPosts();
  }

  componentDidUpdate(prevProps) {
    this.checkFiltersChange(prevProps);
  }

  componentWillUnmount() {
    this.props.clearNewPosts();
  }

  get filterParams() {
    return {
      page: this.state.nextPage,
      perPage: this.state.perPage,
      start: this.props.startDateFilter,
      end: this.props.endDateFilter,
      type: this.props.contentTypesFilter.toArray(),
    };
  }

  get showNoPostsFound() {
    return this.props.posts.isEmpty();
  }

  get noPostsFoundLabel() {
    return 'No Items Found';
  }

  get posts() {
    return this.props.posts
      .sortBy(post => post.get('created_at'))
      .reverse();
  }

  loadPosts = async () => {
    this.props.loadPosts();

    this.setState(state => ({
      nextPage: state.nextPage + 1,
    }));
  }

  checkFiltersChange(prevProps) {
    const filterWasChanged = (
      prevProps.startDateFilter !== this.props.startDateFilter ||
      prevProps.endDateFilter !== this.props.endDateFilter ||
      !prevProps.contentTypesFilter.equals(this.props.contentTypesFilter)
    );

    if (filterWasChanged) {
      this.handleFilterChange();
    }
  }

  removePost = postId =>
    this.setState(({ posts }) => ({
      posts: posts.filter(filterItem => filterItem.get('id') !== postId),
    }))

  handleFilterChange() {
    this.props.clearNewPosts();
    this.setState({
      nextPage: 1,
      posts: List(),
    }, this.loadPosts);
  }

  renderPost = post => (
    <PostItemWrapper
      key={post.get('id')}
      post={post}
      removePost={this.removePost}
    />
  )

  render() {
    return (
      <InfiniteList
        useWindow
        items={this.posts}
        showNoItemsFound={this.showNoPostsFound}
        noItemsFoundLabel={this.noPostsFoundLabel}
        infiniteContainerHeight={800}
        moreItemsMayExist={false}
        pathToCreatedAt={['created_at']}
        renderItem={this.renderPost}
        loadItems={this.loadPosts}
      />
    );
  }
}

Posts.propTypes = {
  startDateFilter: PropTypes.number,
  endDateFilter: PropTypes.number,
  contentTypesFilter: ImmutablePropTypes.set.isRequired,

  clearNewPosts: PropTypes.func.isRequired,
};

Posts.defaultProps = {
  startDateFilter: undefined,
  endDateFilter: undefined,
};


export default connect(
  connect(createStructuredSelector({
    posts: postsSelector,
  })),
  {
    clearNewPosts,
    loadPosts,
  },
)(Posts);
