import React, { Component, PropTypes } from 'react';

import { map } from 'lodash';
import Remarkable from 'remarkable'

class Comments extends Component {
  static propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape({
      comment: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
    })).isRequired,
    commentsLoaded: PropTypes.bool.isRequired,
    failedToLoadComments: PropTypes.bool.isRequired,
  }

  _renderComment = (commentData, key) => {
    const {
      comment,
      timestamp,
    } = commentData;

    const date = new Date(timestamp * 1000);
    const humanReadableDate = date.toString();

    const mdRenderer = new Remarkable();
    const renderedComment = mdRenderer.render(comment);

    return (
      <section key={ key }>
        <time dateTime={ timestamp }>{ humanReadableDate }</time>
        <article dangerouslySetInnerHTML={ {__html: renderedComment} }></article>
      </section>
    );
  }

  render = () => {
    const {
      comments,
    } = this.props;

    return (
      <section>
        { map(comments, this._renderComment) }
      </section>
    );
  }
}

export default Comments;
