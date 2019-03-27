import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List, OrderedMap } from 'immutable';
import moment from 'moment';

import InfiniteScroll from 'react-infinite-scroller';

import grey from '@material-ui/core/colors/grey';

const grey700 = grey['700'];

const INTERVAL_6_HOURS = 6 * 60 * 60 * 1000;
const PERIOD_LABELS = {
  newerThan12Hours: 'Last 12 hours',
  olderThan12Hours: 'Last 24 hours',
  olderThan1Days: 'Earlier this week',
  olderThan7Days: 'Older than 7 days',
  olderThan14Days: 'Older than 14 days',
  olderThan30Days: 'Older than 30 days',
};


class InfiniteList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingByScroll: false,

      periodDates: this.periodDates,
    };

    this.updatePeriodsIntervalId = null;
  }

  componentDidMount() {
    this.updatePeriodsIntervalId = setInterval(
      () => this.setState({ periodDates: this.periodDates }),
      INTERVAL_6_HOURS,
    );
  }

  componentWillUnmount() {
    if (this.updatePeriodsIntervalId) {
      clearInterval(this.updatePeriodsIntervalId);
    }
  }

  get periodDates() {
    return {
      hoursAgo12: moment().subtract(12, 'hours'),
      daysAgo1: moment().subtract(1, 'days'),
      daysAgo7: moment().subtract(7, 'days'),
      daysAgo14: moment().subtract(14, 'days'),
      daysAgo30: moment().subtract(30, 'days'),
    };
  }

  loadItems = async () => {
    if (this.state.isLoadingByScroll) {
      return;
    }

    this.setState({ isLoadingByScroll: true });

    await this.props.loadItems();

    this.setState({ isLoadingByScroll: false });
  }

  renderNoItemsLabel() {
    return (
      <div
        key="c-infinite-list__empty"
      >
        {this.props.noItemsFoundLabel}
      </div>
    );
  }

  renderPeriodSeparator(periodKey) {
    return (
      <div
        key={periodKey}
        style={{ color: grey700 }}
      >
        {PERIOD_LABELS[periodKey]}
      </div>
    );
  }

  renderItems() {
    const {
      hoursAgo12,
      daysAgo1,
      daysAgo7,
      daysAgo14,
      daysAgo30,
    } = this.state.periodDates;

    const itemElsByPeriod = this.props.items.reduce(
      (result, item, index) => {
        let periodKey;
        const itemEl = this.props.renderItem(item, index);
        const itemAt = moment(item.getIn(this.props.pathToCreatedAt));

        if (itemAt >= hoursAgo12) {
          periodKey = 'newerThan12Hours';
        } else if (itemAt < hoursAgo12 && itemAt >= daysAgo1) {
          periodKey = 'olderThan12Hours';
        } else if (itemAt < daysAgo1 && itemAt >= daysAgo7) {
          periodKey = 'olderThan1Days';
        } else if (itemAt < daysAgo7 && itemAt >= daysAgo14) {
          periodKey = 'olderThan7Days';
        } else if (itemAt < daysAgo14 && itemAt >= daysAgo30) {
          periodKey = 'olderThan14Days';
        } else if (itemAt < daysAgo30) {
          periodKey = 'olderThan30Days';
        }

        return result.setIn([periodKey, result.get(periodKey).size], itemEl);
      },
      OrderedMap({
        newerThan12Hours: List(),
        olderThan12Hours: List(),
        olderThan1Days: List(),
        olderThan7Days: List(),
        olderThan14Days: List(),
        olderThan30Days: List(),
      }),
    );

    const itemElsWithPeriodEls = itemElsByPeriod.reduce(
      (result, periodEls, periodKey) => (
        periodEls.isEmpty()
          ? result.concat(periodEls)
          : result.concat(periodEls.unshift(this.renderPeriodSeparator(periodKey)))
      ),
      List(),
    );

    return itemElsWithPeriodEls;
  }

  render() {
    return (
      <div
        style={{ height: this.props.infiniteContainerHeight }}
      >
        <InfiniteScroll
          loadMore={this.loadItems}
          hasMore={this.props.moreItemsMayExist && !this.props.showNoItemsFound}
          useWindow={this.props.useWindow}
        >
          {this.renderItems()}
        </InfiniteScroll>

        {this.props.showNoItemsFound &&
          this.renderNoItemsLabel()
        }
      </div>
    );
  }
}

InfiniteList.propTypes = {
  useWindow: PropTypes.bool,
  headerComponent: PropTypes.node,
  items: ImmutablePropTypes.list.isRequired,
  showNoItemsFound: PropTypes.bool.isRequired,
  noItemsFoundLabel: PropTypes.string.isRequired,
  infiniteContainerHeight: PropTypes.number,
  moreItemsMayExist: PropTypes.bool.isRequired,
  pathToCreatedAt: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderItem: PropTypes.func.isRequired,
  loadItems: PropTypes.func.isRequired,
};

InfiniteList.defaultProps = {
  infiniteClassName: null,
  useWindow: false,
  headerComponent: null,
  infiniteContainerHeight: null,
};

export default InfiniteList;
