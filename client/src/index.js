import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import io from "socket.io-client";
import App from "./App.js";


let END_POINT = process.env.REACT_APP_URL;

const socket = io(END_POINT, {
  transports: ["websocket", "polling", "flashsocket"],
});

const socketContext = createContext();


ReactDOM.render(
  <>
    <socketContext.Provider value={socket}>
      <App />
    </socketContext.Provider>
  </>,
  document.getElementById("root")
);

export {socketContext};