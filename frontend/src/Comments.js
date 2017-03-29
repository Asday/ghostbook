import React, { Component, PropTypes } from 'react';

import { map } from 'lodash';
import Remarkable from 'remarkable';

class Comments extends Component {
  static propTypes = {
    _referenceComment: PropTypes.func.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      comment: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      timestamp: PropTypes.number.isRequired,
    })).isRequired,
    commentsLoaded: PropTypes.bool.isRequired,
    failedToLoadComments: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.mdRenderer = new Remarkable();
  }

  _handleCommentIdClicked = (event) => {
    this.props._referenceComment(parseInt(event.target.name, 10));
  }

  _renderComment = (commentData) => {
    const {
      comment,
      id,
      timestamp,
    } = commentData;

    const {
      _handleCommentIdClicked,
    } = this;

    const date = new Date(timestamp * 1000);
    const humanReadableDate = date.toString();

    const renderedComment = this.mdRenderer.render(comment);

    return (
      <section key={ id }>
        <time dateTime={ timestamp }>{ humanReadableDate }</time>
        <a name={ id } href="#" onClick={ _handleCommentIdClicked }>&gt;&gt;{ id }</a>
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
