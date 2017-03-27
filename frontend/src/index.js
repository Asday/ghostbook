import React from 'react';
import ReactDOM from 'react-dom';
import Ghostbook from './Ghostbook';

const appRoot = document.querySelector(
  '[data-ghostbook-url], [data-ghostbook-comments-root], [data-ghostbook-id]')

if (appRoot) {
  const {
    ghostbookUrl,
    ghostbookCommentsRoot,
    ghostbookId,
  } = appRoot.dataset;

  ReactDOM.render(
    <Ghostbook
      ghostbookUrl={ ghostbookUrl }
      ghostbookCommentsRoot={ ghostbookCommentsRoot }
      ghostbookId={ ghostbookId }
    />,
    appRoot,
  );
}
