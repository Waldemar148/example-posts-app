import React from 'react';
import PropTypes from 'prop-types';
import toJS from 'react-immutable-hoc';

import Typography from '@material-ui/core/Typography';


const SimplePostItem = ({
  post: {
    context: {
      post: {
        text,
      },
    },
  },
}) => (
  <div>
    {text &&
      <Typography
        variant="body1"
        style={{ whiteSpace: 'pre' }}
        gutterBottom
      >
        {text}
      </Typography>
    }
  </div>
);

SimplePostItem.propTypes = {
  post: PropTypes.shape({
    context: PropTypes.shape({
      post: PropTypes.shape({
        text: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default toJS(SimplePostItem);
