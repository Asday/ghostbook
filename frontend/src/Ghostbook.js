import React, { Component, PropTypes } from 'react';

class Ghostbook extends Component {
  static propTypes = {
    ghostbookUrl: PropTypes.string.isRequired,
    ghostbookCommentsRoot: PropTypes.string.isRequired,
    ghostbookId: PropTypes.string.isRequired,
  }

  render() {
    const {
      ghostbookId,
      ghostbookUrl,
      ghostbookCommentsRoot,
    } = this.props;
    return (
      <div>
        Id: {ghostbookId}
        <br />
        URL: {ghostbookUrl}
        <br />
        Comments root: {ghostbookCommentsRoot}
      </div>
    );
  }
}

export default Ghostbook;
