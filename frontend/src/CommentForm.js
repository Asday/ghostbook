import React, { Component, PropTypes } from 'react';

class CommentForm extends Component {
  static propTypes = {
    _commentChanged: PropTypes.func.isRequired,
    _submitComment: PropTypes.func.isRequired,
    comment: PropTypes.string.isRequired,
  }

  _handleCommentChange = (event) => {
    const {
      value,
      selectionStart,
      selectionEnd,
    } = event.target;

    this.props._commentChanged(value, selectionStart, selectionEnd);
  }

  _handleSubmit = (event) => {
    this.props._submitComment();
    event.preventDefault();
  }

  render = () => {
    const {
      _handleSubmit,
      _handleCommentChange,
      props,
    } = this;

    const {
      comment,
    } = props;

    return (
      <form onSubmit={ _handleSubmit }>
        <label>
          Comment:
          <textarea
            value={ comment }
            onChange={ _handleCommentChange }
            onBlur={ _handleCommentChange }
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default CommentForm;
