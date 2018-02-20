import React, { Component, PropTypes } from 'react';

import { map } from 'lodash';

import Comment from './Comment'

// TODO:  Why does the linter shoot me in the head here?
// eslint-disable-next-line
const spinner = require('!!raw!./spinner.html');

class Comments extends Component {
  static propTypes = {
    _referenceComment: PropTypes.func.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      comment: PropTypes.string.isRequired,
      failedToSubmit: PropTypes.bool.isRequired,
      id: PropTypes.number.isRequired,
      optimistic: PropTypes.bool.isRequired,
      submitting: PropTypes.bool.isRequired,
      timestamp: PropTypes.number.isRequired,
    })).isRequired,
    commentsLoaded: PropTypes.bool.isRequired,
    failedToLoadComments: PropTypes.bool.isRequired,
  }

  _renderComments = () => {
    const {
      _referenceComment,
      comments,
    } = this.props;

    return (
      <section>
        { map(comments, (comment) => <Comment
          key={ comment.id }
          { ...comment }
          _referenceComment={ _referenceComment }
        />) }
      </section>
    );
  }

  _renderFailedToLoadComments = () => {
    return (
      <section>
        <strong>Failed to load comments.</strong>
      </section>
    );
  }

  _renderLoadingComments = () => {
    return (
      <section dangerouslySetInnerHTML={ {__html: spinner} }></section>
    );
  }

  render = () => {
    const {
      commentsLoaded,
      failedToLoadComments,
    } = this.props;

    if (commentsLoaded) {
      return this._renderComments();
    } else if (failedToLoadComments) {
      return this._renderFailedToLoadComments();
    } else {
      return this._renderLoadingComments();
    }
  }
}

export default Comments;
