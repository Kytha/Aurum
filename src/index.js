import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  },
  palette: {
    background: {
      default: "#f9f9fb",
      paper: "#fff",
    },
  },
});

const initialState = {};
const middleware = [thunk];
const getEnhancer = () => {
  if (process.env.NODE_ENV !== "production")
    return composeWithDevTools(applyMiddleware(...middleware));
  else return applyMiddleware(...middleware);
};
const store = createStore(reducers, initialState, getEnhancer());

const entryPoint = document.getElementById("app");
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </ThemeProvider>,
  entryPoint
);
