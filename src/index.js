import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/styles.css";
import App from "./App";
import ErrorBoundary from "./helpers/ErrorBoundary";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate  persistor={persistor}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    </PersistGate>
    </Provider>
  </React.StrictMode>
);
