import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withStyles } from '@material-ui/core/styles';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

import Sidebar from './Sidebar';

import { SIDEBAR_FILTERS } from '../constants/posts';

const {
  DATE_RANGE_FILTERS,
  CONTENT_TYPE_FILTERS,
} = SIDEBAR_FILTERS;

const muiStyles = {
  radioRoot: {
    paddingTop: 0,
    paddingBottom: 2,
  },
  textInputRoot: {
    width: 145,
    height: 70,
    marginTop: 10,
  },
  fontControlLabelLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};


class PostsSidebar extends PureComponent {
  get sidebarSections() {
    return [{
      label: 'Date Range',
      children: this.renderDateRangeFilters(),
    }, {
      label: 'Content',
      children: this.renderContentTypeFilters(),
    }];
  }

  renderDateRangeFilters() {
    return (
      <React.Fragment>
        <RadioGroup
          key="dateRange"
          aria-label="Date Range"
          value={this.props.dateRangeFilter}
          onChange={this.props.handleChangeDateRangeFilter}
        >
          {DATE_RANGE_FILTERS.map(this.renderFilterRadio)}
        </RadioGroup>

        {this.props.dateRangeFilter === DATE_RANGE_FILTERS[5].value &&
          <React.Fragment key="dateTextFields">
            <TextField
              key="startDateTextField"
              classes={{ root: this.props.classes.textInputRoot }}
              label="Start"
              placeholder={this.props.dateFormat}
              helperText={this.props.startDateFilterError && this.props.dateFormat}
              value={this.props.startDateFilter}
              error={this.props.startDateFilterError}
              onChange={this.props.handleChangeDateFilter('startDateFilter')}
              InputLabelProps={{ shrink: true }}
            />

            <br key="br" />

            <TextField
              key="endDateTextField"
              classes={{ root: this.props.classes.textInputRoot }}
              label="End"
              placeholder={this.props.dateFormat}
              helperText={this.props.endDateFilterError && this.props.dateFormat}
              value={this.props.endDateFilter}
              error={this.props.endDateFilterError}
              onChange={this.props.handleChangeDateFilter('endDateFilter')}
              InputLabelProps={{ shrink: true }}
            />
          </React.Fragment>
        }
      </React.Fragment>
    );
  }

  renderContentTypeFilters() {
    return (
      <FormGroup>
        {CONTENT_TYPE_FILTERS
          .map(this.renderContentTypeFilterCheckbox)
        }
      </FormGroup>
    );
  }

  renderFilterRadio = ({ label, value }) => (
    <FormControlLabel
      key={value}
      classes={{ label: this.props.classes.fontControlLabelLabel }}
      label={label}
      value={value}
      control={
        <Radio
          classes={{ root: this.props.classes.radioRoot }}
          color="primary"
          disableRipple
        />
      }
    />
  );

  renderContentTypeFilterCheckbox = ({ label, value }) => (
    <FormControlLabel
      key={value}
      classes={{ label: this.props.classes.fontControlLabelLabel }}
      label={label}
      control={
        <Checkbox
          classes={{ root: this.props.classes.radioRoot }}
          color="primary"
          disableRipple
          checked={this.props.contentTypesFilter.get(value, false)}
          value={value}
          onChange={this.props.handleChangeContentTypesFilter(value)}
        />
      }
    />
  )

  render() {
    return (
      <Sidebar
        sections={this.sidebarSections}
        cols={2}
        initiallyOpen
        paddingLeft={40}
      />
    );
  }
}

PostsSidebar.propTypes = {
  dateRangeFilter: PropTypes.string.isRequired,
  startDateFilter: PropTypes.string.isRequired,
  endDateFilter: PropTypes.string.isRequired,
  startDateFilterError: PropTypes.bool.isRequired,
  endDateFilterError: PropTypes.bool.isRequired,
  contentTypesFilter: ImmutablePropTypes.set.isRequired,
  handleChangeDateRangeFilter: PropTypes.func.isRequired,
  handleChangeDateFilter: PropTypes.func.isRequired,
  handleChangeContentTypesFilter: PropTypes.func.isRequired,
  dateFormat: PropTypes.string.isRequired,

  classes: PropTypes.object.isRequired,
};

export default withStyles(muiStyles)(PostsSidebar);
