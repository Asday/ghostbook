import React, { Component, PropTypes } from 'react';

class CommentForm extends Component {
  static propTypes = {
    comment: PropTypes.string.isRequired,
  }

  render = () => {
    const {
      comment,
    } = this.props;

    return (
      <div>{ comment }</div>
    );
  }
}

export default CommentForm;
