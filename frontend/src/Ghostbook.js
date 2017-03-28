import React, { Component, PropTypes } from 'react';

class Ghostbook extends Component {
  static propTypes = {
    ghostbookUrl: PropTypes.string.isRequired,
    ghostbookCommentsRoot: PropTypes.string.isRequired,
    ghostbookId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      commentsLoaded: false,
      comment: "",
    };
  }

  componentDidMount() {
    const {
      ghostbookId,
      ghostbookCommentsRoot,
    } = this.props;

    fetch(`${ghostbookCommentsRoot}${ghostbookId}.json`)
      .then((response) => {
        if (response.ok) {
          response.json().then((comments) => {
            this.setState({comments, commentsLoaded: true});
          });
        }
      });
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
