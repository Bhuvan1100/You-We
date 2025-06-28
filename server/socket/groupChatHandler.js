// backend/handlers/groupChatHandler.js
export const handleGroupChat = (io, socket) => {
 
  socket.on("join-group", ({ topic, user }) => {
    
    socket.userId = user.id || user.name;
    socket.userName = user.name;
    socket.currentTopic = topic;
    
    
    socket.join(topic);
    console.log(`${user.name} joined ${topic}`);
    
    // Send join notification to all users in the room (including the user who joined)
    io.to(topic).emit("user-joined", {
      user,
      timestamp: new Date().toISOString(),
      messageId: `join-${Date.now()}-${user.name}`
    });
    
    // Get all sockets in this room to send online users list
    const room = io.sockets.adapter.rooms.get(topic);
    const onlineUsers = [];
    
    if (room) {
      room.forEach(socketId => {
        const socketInRoom = io.sockets.sockets.get(socketId);
        if (socketInRoom?.userName) {
          onlineUsers.push({
            id: socketInRoom.userId,
            name: socketInRoom.userName
          });
        }
      });
    }
    
    // Send updated online users list to all users in the room
    io.to(topic).emit("online-users-updated", onlineUsers);
  });

  // Handle regular messages
  socket.on("group-message", ({ topic, text, sender, timestamp, messageId }) => {
    const messageData = {
      sender,
      text,
      timestamp: timestamp || new Date().toISOString(),
      messageId: messageId || `msg-${Date.now()}-${Math.random()}`
    };
    
    // Broadcast message to all users in the room
    io.to(topic).emit("group-message", messageData);
    console.log(`Message in ${topic} from ${sender}: ${text}`);
  });

  // Handle typing indicators
  socket.on("typing", ({ topic, user }) => {
    socket.to(topic).emit("user-typing", { user });
  });

  socket.on("stop-typing", ({ topic, user }) => {
    socket.to(topic).emit("user-stopped-typing", { user });
  });

  // Handle user leaving
  socket.on("leave-group", ({ topic, user }) => {
    socket.leave(topic);
    console.log(`${user.name} left ${topic}`);
    
    // Send leave notification
    socket.to(topic).emit("user-left", {
      user,
      timestamp: new Date().toISOString(),
      messageId: `leave-${Date.now()}-${user.name}`
    });
    
    // Update online users list
    setTimeout(() => {
      const room = io.sockets.adapter.rooms.get(topic);
      const onlineUsers = [];
      
      if (room) {
        room.forEach(socketId => {
          const socketInRoom = io.sockets.sockets.get(socketId);
          if (socketInRoom?.userName) {
            onlineUsers.push({
              id: socketInRoom.userId,
              name: socketInRoom.userName
            });
          }
        });
      }
      
      io.to(topic).emit("online-users-updated", onlineUsers);
    }, 100);
  });

  // Handle disconnect (when user closes browser/tab)
  socket.on("disconnect", () => {
    if (socket.currentTopic && socket.userName) {
      console.log(`${socket.userName} disconnected from ${socket.currentTopic}`);
      
      // Send leave notification
      socket.to(socket.currentTopic).emit("user-left", {
        user: { name: socket.userName, id: socket.userId },
        timestamp: new Date().toISOString(),
        messageId: `leave-${Date.now()}-${socket.userName}`
      });
      
      // Update online users list after a short delay
      setTimeout(() => {
        const room = io.sockets.adapter.rooms.get(socket.currentTopic);
        const onlineUsers = [];
        
        if (room) {
          room.forEach(socketId => {
            const socketInRoom = io.sockets.sockets.get(socketId);
            if (socketInRoom?.userName && socketInRoom.id !== socket.id) {
              onlineUsers.push({
                id: socketInRoom.userId,
                name: socketInRoom.userName
              });
            }
          });
        }
        
        io.to(socket.currentTopic).emit("online-users-updated", onlineUsers);
      }, 100);
    }
  });
};