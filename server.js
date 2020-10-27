const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server);

const users = [];

io.on('connection', (socket) => {
  console.log('new user connected');
  socket.emit('chat-message', 'Welcome to the chat app');
  socket.on('send-chat-message', (message) => {
    console.log(message);
    socket.broadcast.emit('chat-message', message);
  });
  socket.on('register', (user) => {
    if (!user.username) {
      return socket.emit('username-required');
    }
    if (!user.password) {
      return socket.emit('password-required');
    }
    const foundUser = users.find(
      (e) => e.password === user.password && user.username === e.username,
    );
    if (foundUser) {
      return socket.emit('username-in-use');
    }
    users.push(user);
    console.log(users);
    return socket.emit('registration-success', user);
  });
  socket.on('login', (user) => {
    if (!user.username) {
      return socket.emit('username-required');
    }
    if (!user.password) {
      return socket.emit('password-required');
    }
    const foundUser = users.find(
      (e) => e.password === user.password && user.username === e.username,
    );
    if (!foundUser) {
      return socket.emit('wrong-email-or-password');
    }
    return socket.emit('login-success', foundUser);
  });
});

app.use('/', express.static('app'));
server.listen(3000);
