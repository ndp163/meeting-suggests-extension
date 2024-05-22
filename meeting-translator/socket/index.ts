import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object

export const socket = io("ws://localhost:3000");

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("connect_error", (error) => {
  if (socket.active) {
    // temporary failure, the socket will automatically try to reconnect
  } else {
    // the connection was denied by the server
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(error.message);
  }
});

socket.on("disconnect", (reason) => {
  if (socket.active) {
    // temporary disconnection, the socket will automatically try to reconnect
  } else {
    // the connection was forcefully closed by the server or the client itself
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(reason);
  }
});