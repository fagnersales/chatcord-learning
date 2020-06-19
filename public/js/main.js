// getting the chat form
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// Get username and room from URL

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

// Join chatroom
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputRoomUsers(users)
})

socket.on("message", message => {
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// submit content from the chart form
chatForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const message = event.target.elements.msg.value

    // Emit message to the server
    socket.emit('chatMessage', message)

    // Clear input
    event.target.elements.msg.value = ""
    // Keep the target at the input 
    event.target.elements.msg.focus()
})

// Output message to DOM
function outputMessage({ author, time, content }) {
    const div = document.createElement('div')

    div.classList.add('message')

    div.innerHTML = `<p class ="meta">${author.username} <span>${time}</span></p>
    <p class="text">
    ${content}
    </p>`

    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room
}

// Add users to DOM
function outputRoomUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join("")}
    `
}