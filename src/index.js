import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/styles.css";
import App from "./App";
import ErrorBoundary from "./helpers/ErrorBoundary";
import { Provider } from "react-redux";
import { store } from "./redux/store";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);
