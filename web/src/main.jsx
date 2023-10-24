import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@app/store'
// style + assets
import '@app/assets/scss/style.scss';
import config from '@app/config';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store/index.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>


      <BrowserRouter basename={config.basename}>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
