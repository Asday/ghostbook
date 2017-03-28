import React, { Component, PropTypes } from 'react';

class Comments extends Component {
  static propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
    })).isRequired,
    commentsLoaded: PropTypes.bool.isRequired,
    failedToLoadComments: PropTypes.bool.isRequired,
  }

  render() {
    const {
      comments,
    } = this.props;

    return (
      <div>{ comments.length }</div>
    );
  }
}

export default Comments;
