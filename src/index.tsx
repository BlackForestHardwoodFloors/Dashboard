import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppBootstrap } from './components/AppBootstrap';
import './styles/globals.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppBootstrap>
        <App />
      </AppBootstrap>
    </React.StrictMode>
  );
}