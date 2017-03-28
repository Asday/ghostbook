import React, { Component, PropTypes } from 'react';

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
            this.setState({comments, commentsLoaded: true});
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

  componentDidMount = () => {
    this._fetchComments();
  }

  render = () => {
    const {
      comment,
      comments,
      commentsLoaded,
      failedToLoadComments,
    } = this.state;

    return (
      <section>
        <CommentForm comment={ comment } />
        <Comments
          comments={ comments }
          commentsLoaded={ commentsLoaded }
          failedToLoadComments={ failedToLoadComments }
        />
      </section>
    );
  }
}

export default Ghostbook;
