import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';

import PostSidebar from './PostSidebar';
import Posts from './Posts';

import { SIDEBAR_FILTERS, POST_TYPES_BY_KEY } from '../constants/posts';

const {
  DATE_RANGE_FILTERS,
  CONTENT_TYPE_FILTERS,
} = SIDEBAR_FILTERS;

const DATE_FORMAT = 'MM/DD/YY HH:mm';

const styles = {
  columnList: {
    paddingLeft: 0,
  },
};


class PostsPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dateRangeFilter: 'all',

      startDateFilter: '',
      endDateFilter: '',

      startDateFilterError: false,
      endDateFilterError: false,

      contentTypesFilter: this.defaultContentTypesFilter.toSet(),
    };
  }

  get defaultContentTypesFilter() {
    const contentTypesFilter = CONTENT_TYPE_FILTERS
      .reduce(
        (result, { value }) => [...result, value],
        [],
      );

    return List(contentTypesFilter);
  }


  get currentSegmentContentTypesFilter() {
    return this.state.contentTypesFilter
      .filter(type => POST_TYPES_BY_KEY[type].segment.includes(this.props.currentSegment));
  }

  getDateTimestamp(dateFilterKey) {
    return this.state[dateFilterKey] === '' || !moment(this.state[dateFilterKey], DATE_FORMAT, true).isValid()
      ? null
      : moment(this.state[dateFilterKey], DATE_FORMAT).valueOf();
  }

  handleChangeDateRangeFilter = event => this.changeDataRangeFilter(event.target.value)

  handleChangeDateFilter = dateFilterKey => (event) => {
    this.setState({
      [dateFilterKey]: event.target.value,
      [`${dateFilterKey}Error`]: !!event.target.value && !moment(event.target.value, DATE_FORMAT, true).isValid(),
    });
  };

  handleChangeContentTypesFilter = name => ({ target: { checked } }) => {
    this.setState(({ contentTypesFilter }) => ({
      contentTypesFilter: checked
        ? contentTypesFilter.add(name)
        : contentTypesFilter.delete(name),
    }));
  }

  changeDataRangeFilter(value) {
    let startDateFilter;
    let endDateFilter;

    switch (value) {
      case DATE_RANGE_FILTERS[1].value: // 'last12Hours'
        startDateFilter = moment().subtract(12, 'hours').format(DATE_FORMAT);
        endDateFilter = moment().format(DATE_FORMAT);
        break;

      case DATE_RANGE_FILTERS[2].value: // 'last24hours'
        startDateFilter = moment().subtract(1, 'days').format(DATE_FORMAT);
        endDateFilter = moment().format(DATE_FORMAT);
        break;

      case DATE_RANGE_FILTERS[3].value: // 'last7Days'
        startDateFilter = moment().subtract(7, 'days').format(DATE_FORMAT);
        endDateFilter = moment().format(DATE_FORMAT);
        break;

      case DATE_RANGE_FILTERS[4].value: // 'lastMonth'
        startDateFilter = moment().subtract(1, 'month').format(DATE_FORMAT);
        endDateFilter = moment().format(DATE_FORMAT);
        break;

      case 'all':
      case 'custom':
      default:
        startDateFilter = '';
        endDateFilter = '';
        break;
    }

    this.setState({
      dateRangeFilter: value,
      startDateFilter,
      endDateFilter,
    });
  }

  render() {
    return (
      <div>
        <Grid container style={{ marginBottom: 0 }}>
          <Grid
            item
            xs={12}
            md={4}
            lg={2}
            style={styles.columnList}
          >
            <PostSidebar
              dateRangeFilter={this.state.dateRangeFilter}
              startDateFilter={this.state.startDateFilter}
              endDateFilter={this.state.endDateFilter}
              startDateFilterError={this.state.startDateFilterError}
              endDateFilterError={this.state.endDateFilterError}
              contentTypesFilter={this.state.contentTypesFilter}
              handleChangeDateRangeFilter={this.handleChangeDateRangeFilter}
              handleChangeDateFilter={this.handleChangeDateFilter}
              handleChangeContentTypesFilter={this.handleChangeContentTypesFilter}
              dateFormat={DATE_FORMAT}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={8}
            lg={10}
          >
            <Grid container>
              <Grid item xs={12} md={12} lg={12}>
                <Posts
                  startDateFilter={this.getDateTimestamp('startDateFilter')}
                  endDateFilter={this.getDateTimestamp('endDateFilter')}
                  contentTypesFilter={this.currentSegmentContentTypesFilter}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

PostsPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default PostsPage;
