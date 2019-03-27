import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';
import { List } from 'immutable';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';

import grey from '@material-ui/core/colors/grey';

import './SimplePostItem';

import { POST_TYPES_BY_KEY } from '../constants/posts';

const CREATED_AT_FORMAT = 'MM/DD/YY H:mm';
const LIKES_VISIBLE_AMOUNT = 20;

const styles = {
  iconWrapper: {
    width: 46,
    height: 46,
    backgroundColor: 'grey',
    borderRadius: 23,
    position: 'absolute',
    top: 15,
    left: -23,
    padding: 9,
  },
  reactionsWrapper: {
    minHeight: 48,
    marginTop: 5,
  },
};

const muiStyles = {
  paperRoot: {
    padding: '15px 15px 5px 35px',
    position: 'relative',
    marginBottom: 10,
  },
  typeRoot: {
    flexShrink: 0,
  },
  createdAtRoot: {
    flexShrink: 0,
    marginLeft: 'auto',
  },
  headerDividerRoor: {
    margin: '10px 0',
  },
  reactionTypographyRoot: {
    color: grey[400],
    display: 'inline-block',
    margin: '0 5px',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};


class Post extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoadingLikes: false,

      likes: List(),
    };
  }

  get typeLabel() {
    return POST_TYPES_BY_KEY[this.props.post.get('type')].label;
  }

  renderIcon() {
    switch (this.props.post.get('type')) {
      case POST_TYPES_BY_KEY.post.type: {
        return this.renderSimplePostIcon();
      }

      default: {
        return null
      }
    }
  }

  renderSimplePostIcon = () => {
    return (
      <div style={{ ...styles.iconWrapper }}>
        <WorkOutlineIcon />
      </div>
    );
  }

  renderCreatedAt() {
    return (
      <Typography classes={{ root: this.props.classes.createdAtRoot }}>
        {moment(this.props.post.get('created_at')).format(CREATED_AT_FORMAT)}
      </Typography>
    );
  }

  renderContent() {
    switch (this.props.post.get('type')) {
      case POST_TYPES_BY_KEY.post.type:
        return <SimplePostItem post={this.props.post} />;

      default:
        return null;
    }
  }

  renderNoLikes() {
    return 'Nobody like this yet...';
  }

  renderLikes() {
    const likesAmount = this.state.likes.size;

    if (!likesAmount) {
      return this.renderNoLikes();
    }

    let likesInvisibleText = '';

    if (likesAmount > LIKES_VISIBLE_AMOUNT) {
      const likesInvisibleAmount = likesAmount - LIKES_VISIBLE_AMOUNT;
      likesInvisibleText = `\nand ${likesInvisibleAmount} more...`;
    }

    const likesVisibleText = this.state.likes
      .slice(0, LIKES_VISIBLE_AMOUNT)
      .join('\n');

    return `${likesVisibleText}${likesInvisibleText}`;
  }

  renderLikesTitle() {
    return this.state.isLoadingLikes
      ? 'Loading...'
      : this.renderLikes();
  }

  renderReactions() {
    const likesCount = this.props.post.get('likes_count');

    const liked = this.props.post.get('liked');

    return (
      <div style={styles.reactionsWrapper}>
        <IconButton
          aria-label="Like"
        >
          <ThumbUpIcon nativeColor={liked ? this.props.theme.palette.primary.main : grey[400]} />
        </IconButton>

        <Tooltip
          title={this.renderLikesTitle()}
          enterTouchDelay={0}
        >
          <Typography
            classes={{ root: this.props.classes.reactionTypographyRoot }}
            variant="caption"
          >
            Likes {likesCount}
          </Typography>
        </Tooltip>
      </div>
    );
  }

  render() {
    return (
      <Paper
        className={classNames('c-posts-item', {
          'c-posts-item--hide-overflow': this.state.isLoading,
        })}
        classes={{ root: this.props.classes.paperRoot }}
        elevation={0}
      >
        {this.renderIcon()}

        {this.renderCreatedAt()}

        <Divider classes={{ root: this.props.classes.headerDividerRoor }} />

        {this.renderContent()}

        {this.renderReactions()}
      </Paper>
    );
  }
}

Post.propTypes = {
  post: ImmutablePropTypes.mapContains({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    context: ImmutablePropTypes.map.isRequired,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.object,
  }).isRequired,

  classes: PropTypes.object.isRequired,
};

export default withStyles(muiStyles)(Post);
