import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = {
  cols: cols => ({
    width: `${Math.floor(100 / cols)}%`,
    display: 'inline-block',
    verticalAlign: 'top',
  }),
};

const muiStyles = {
  collapseWrapper: {
    padding: '10px 0',
  },
  iconRoot: {
    marginRight: 15,
  },
};


class Sidebar extends PureComponent {
  constructor(props) {
    super(props);

    const openSectionKeys = props.sections.reduce(
      (result, section) => (
        this.getSectionVisible(section)
          ? { ...result, [this.getSectionOpenKey(section)]: props.initiallyOpen }
          : result
      ),
      {},
    );

    this.state = { ...openSectionKeys };
  }

  getSectionOpenKey = section => `open${camelCase(section.label)}`

  getSectionVisible = section => (
    section.visible === undefined
      ? true
      : section.visible
  )

  handleClick = (openSectionKey) => {
    this.setState(state => ({ [openSectionKey]: !state[openSectionKey] }));
  };

  render() {
    return (
      <List component="nav">
        {this.props.sections.map((section) => {
          if (!this.getSectionVisible(section)) return null;

          const openSectionKey = this.getSectionOpenKey(section);
          return (
            <div
              key={openSectionKey}
              style={styles.cols(this.props.cols)}
            >
              <ListItem
                button
                disableGutters
                onClick={() => this.handleClick(openSectionKey)}
              >
                <ListItemText
                  style={{ paddingLeft: this.props.paddingLeft }}
                  primary={section.label}
                />

                {this.state[openSectionKey]
                  ? <ExpandLessIcon classes={{ root: this.props.classes.iconRoot }} />
                  : <ExpandMoreIcon classes={{ root: this.props.classes.iconRoot }} />
                }
              </ListItem>

              <Collapse
                classes={{
                  wrapper: this.props.classes.collapseWrapper,
                }}
                style={{ paddingLeft: this.props.paddingLeft }}
                in={this.state[openSectionKey]}
                timeout="auto"
              >
                {section.children}
              </Collapse>
            </div>
          );
        })}
      </List>
    );
  }
}

Sidebar.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    visible: PropTypes.bool,
  })).isRequired,
  cols: PropTypes.number,
  initiallyOpen: PropTypes.bool,
  paddingLeft: PropTypes.number,

  classes: PropTypes.object.isRequired,
};

Sidebar.defaultProps = {
  cols: 1,
  initiallyOpen: true,
  paddingLeft: 0,
};

export default withStyles(muiStyles)(Sidebar);
