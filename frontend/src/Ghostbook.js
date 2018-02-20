import React, { Component, PropTypes } from 'react';

import { map } from 'lodash';

import CommentForm from './CommentForm';
import Comments from './Comments';

class Ghostbook extends Component {
  static propTypes = {
    ghostbookUrl: PropTypes.string.isRequired,
    ghostbookCommentsRoot: PropTypes.string.isRequired,
    ghostbookId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      comment: "",
      commentSelectionEnd: 0,
      commentSelectionStart: 0,
      comments: [],
      commentsLoaded: false,
      failedToLoadComments: false,
    };
  }

  _fetchComments = () => {
    const {
      ghostbookId,
      ghostbookCommentsRoot,
    } = this.props;

    // TODO:  This spews 404-related errors in the console when the
    // comments thread doesn't exist yet.  Apparently that's unfixable,
    // but it sucks and I hate it.
    // https://bugs.chromium.org/p/chromium/issues/detail?id=124534
    // suggests this is a wontfix, which also sucks.
    //
    // Until then, I'm spewing a console log to assuage passing console
    // peekers' fears.
    fetch(`${ghostbookCommentsRoot}${ghostbookId}.json`)
      .then((response) => {
        if (response.ok) {
          response.json().then((comments) => {
            this.setState({
              comments: map(comments, (comment) => ({
                  ...comment,
                  optimistic: false,
                  failedToSubmit: false,
                  submitting: false,
                })),
              commentsLoaded: true,
            });
          });
        } else {
          this.setState({failedToLoadComments: true});
        }
      })
      .catch((error) => {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          console.log('The above error, if your browser displayed one, was expected; no ghostbook comments exist for this ID yet.');
          this.setState({commentsLoaded: true});
        }
      });
  }

  _commentChanged = (comment, commentSelectionStart, commentSelectionEnd) => {
    this.setState({comment, commentSelectionStart, commentSelectionEnd});
  }

  _submitComment = () => {
    const {
      ghostbookId,
      ghostbookUrl,
    } = this.props;

    const {
      comment,
      comments
    } = this.state;

    const data = JSON.stringify({ghostbookId, comment});
    const commentId = this.state.comments.length + 1;
    const timestamp = Math.round(Date.now() / 1000);
    const newComment = {
      id: commentId,
      comment,
      timestamp,
      submitting: true,
      failedToSubmit: false,
      optimistic: true,
    };

    this.setState({
      comments: [newComment, ...comments],
      comment: "",
      commentSelectionEnd: 0,
      commentSelectionStart: 0,
    });

    const mutateComments = (mutator) => {
      this.setState({comments: map(this.state.comments, (comment) => {
        if (comment.submitting && comment.timestamp === timestamp) {
          return mutator(comment);
        } else {
          return comment;
        }
      })});
    }

    const setSubmitted = () => {
      mutateComments((comment) => ({
        ...comment,
        id: comment.id,
        comment: comment.comment,
        timestamp: comment.timestamp,
        optimistic: false,
        submitting: false,
      }));
    }

    const setSubmissionFailed = () => {
      mutateComments((comment) => ({
        ...comment,
        submitting: false,
        failedToSubmit: true,
      }));
    }

    fetch(`${ghostbookUrl}comment`, {method: 'POST', body: data})
      .then((response) => {
        if (response.ok) {
          setSubmitted();
        } else {
          setSubmissionFailed();
        }
      })
      .catch(() => {
        setSubmissionFailed();
      });
  }

  _referenceComment = (commentId) => {
    const {
      comment,
      commentSelectionEnd,
      commentSelectionStart,
    } = this.state;

    const pre = comment.substring(0, commentSelectionStart);
    const commentReference = `[>>${commentId}](#${commentId})`;
    const post = comment.substring(commentSelectionEnd);

    const newComment = `${pre}${commentReference}${post}`;
    const newCursorPos = commentSelectionStart + commentReference.length;

    this.setState({
      comment: newComment,
      commentSelectionEnd: newCursorPos,
      commentSelectionStart: newCursorPos,
    });

    this._commentForm.focus(newCursorPos);
  }

  componentDidMount = () => {
    this._fetchComments();
  }

  render = () => {
    const {
      _commentChanged,
      _referenceComment,
      _submitComment,
      state,
    } = this;

    const {
      comment,
      comments,
      commentsLoaded,
      failedToLoadComments,
    } = state;

    return (
      <section>
        <CommentForm
          comment={ comment }
          _commentChanged={ _commentChanged }
          _submitComment={ _submitComment }
          ref={ (commentForm) => { this._commentForm = commentForm; } }
        />
        <Comments
          comments={ comments }
          commentsLoaded={ commentsLoaded }
          failedToLoadComments={ failedToLoadComments }
          _referenceComment={ _referenceComment }
        />
      </section>
    );
  }
}

export default Ghostbook;
