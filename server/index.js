import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocketConnection } from './socket/oneToOneHnadler.js'; 
import { handleGroupChat } from './socket/groupChatHandler.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("⚡ New Socket.IO connection:", socket.id);
  handleSocketConnection(io, socket);
  handleGroupChat(io,socket);
});



app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
