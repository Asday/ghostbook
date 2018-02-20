import React, { Component, PropTypes } from 'react';

import Remarkable from 'remarkable';

class Comment extends Component {
  static propTypes = {
    _referenceComment: PropTypes.func.isRequired,
    comment: PropTypes.string.isRequired,
    failedToSubmit: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    optimistic: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    timestamp: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    this.mdRenderer = new Remarkable();
  }

  _handleCommentIdClicked = (event) => {
    this.props._referenceComment(parseInt(event.target.name, 10));
  }

  _handleRetryFailedComment = (event) => {
    console.log('TODO:  Retrying comment');
  }

  render = () => {
    const {
      comment,
      failedToSubmit,
      id,
      optimistic,
      submitting,
      timestamp,
    } = this.props;

    const {
      _handleCommentIdClicked,
      _handleRetryFailedComment,
    } = this;

    const renderedComment = this.mdRenderer.render(comment);
    const date = new Date(timestamp * 1000);
    const humanReadableDate = date.toString()

    return  (
      <section>
        { failedToSubmit && <span>
          Failed to submit.  <a name={ timestamp } href="#" onClick={ _handleRetryFailedComment }>Retry?</a>
        </span> }
        { submitting && <span>Submitting...</span> }
        { (failedToSubmit || submitting) && <br /> }
        <time dateTime={ timestamp }>{ humanReadableDate }</time>
        { optimistic
          ? <span>&gt;&gt;{ id }</span>
          : <a name={ id } href="#" onClick={ _handleCommentIdClicked }>&gt;&gt;{ id }</a>
        }
        <article dangerouslySetInnerHTML={ {__html: renderedComment} } />
      </section>
    )
  }
}

export default Comment;
