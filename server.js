const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = "ChatCord Bot"

// Run when client connects
io.on('connection', socket => {


    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        socket.emit('message', formatMessage(botName, `Bem-vindo(a) ao <b>Grupinho do Fag</b>! Você entro na sala: ${room}`))

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit(
            'message',
            formatMessage(botName, `<b>${user.username}</b> entrou na sala`)
        )

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })


    socket.on('chatMessage', message => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, message))
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room)
            .emit('message', formatMessage(botName, `<b>${user.username}</b> saiu da sala`))

            io.to(user.room)
            .emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const PORT = 3333

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
