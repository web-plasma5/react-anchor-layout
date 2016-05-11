import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById('root');

let render = () => {
  const Root = require('./components/Root').default;
  ReactDOM.render(
    <Root />,
    rootEl
  );
};

if (module.hot) {
  const renderApp = render;
  const renderError = error => {
    const RedBox = require('redbox-react');
    ReactDOM.render(
      <RedBox error={error} />,
      rootEl
    );
  };
  render = () => {
    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  module.hot.accept('./components/Root', () => {
    setTimeout(render);
  });
}

render();
