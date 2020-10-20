const express = require('express')

const app = express()
const http = require('http')
const server = http.createServer(app)

const io = require('socket.io')(server)

const users = []

io.on('connection', socket=>{
    console.log("new user connected")
    socket.emit('chat-message', 'Welcome to the chat app')
    socket.on('send-chat-message', message =>{
        console.log(message)
        socket.broadcast.emit('chat-message', message)
    })
    
})


app.use('/',express.static("app"))
server.listen(3000)