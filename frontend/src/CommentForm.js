import React, { Component, PropTypes } from 'react';

class CommentForm extends Component {
  static propTypes = {
    _commentChanged: PropTypes.func.isRequired,
    _submitComment: PropTypes.func.isRequired,
    comment: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)

    // Keep this out of state, as we don't want to render when changing it.
    this._focus = {shouldFocus: false, cursorPos: 0};
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

  focus = (cursorPos) => {
    this._focus = {shouldFocus: true, cursorPos};
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
            ref={ (input) => { this._commentInput = input; } }
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }

  componentDidUpdate = () => {
    const {
      cursorPos,
      shouldFocus,
    } = this._focus;

    if (shouldFocus) {
      this._commentInput.focus();
      this._commentInput.setSelectionRange(cursorPos, cursorPos);
      this._focus.shouldFocus = false;
    }
  }
}

export default CommentForm;
