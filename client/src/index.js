import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import io from "socket.io-client";
import App from "./App.js";
const END_POINT = "http://localhost:8000/";
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