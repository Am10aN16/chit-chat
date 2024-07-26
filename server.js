const express = require("express")
const app = express();
const dotenv = require("dotenv")
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandlers, notFound } = require("./middleware/errorMiddleware");

dotenv.config();

const PORT = process.env.PORT || 5000

app.use(cors());

//to accept json data
app.use(express.json())



app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
} else{
    app.get('/', (req, res) => {
        res.send("Hello from the server")
    })
}

app.use(notFound);
app.use(errorHandlers);

connectDB();
const server =  app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    })
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket io");

    socket.on('setup', (userData)=>{
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('A user joined chat', room);
    });

    socket.on('typing', (room)=> socket.in(room).emit('typing'));
    socket.on('stop typing', (room)=> socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach((user) => {
            if(user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit('message received', newMessageReceived);
        });
    })

    socket.off('setup', () => {
        console.log('User Disconnected');
        socket.leave(userrData._id);
    });
});
