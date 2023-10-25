// import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from 'react-redux'
import store from '@app/store'
import App from "@app/App";
import "@app/styles/global.scss";

import '@fontsource-variable/public-sans';





ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
);