import React from 'react';
import ReactDOM from 'react-dom';
import '@livechat/design-system/dist/design-system.css';
import './index.css';
import App from './App';

if (process.env.REACT_APP_CLIENT_ID) {
    ReactDOM.render(<App />, document.getElementById('root'));
} else {
    throw new Error('Missing CLIENT_ID value');
}
