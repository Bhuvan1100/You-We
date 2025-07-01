const rooms = new Map();

export const handlePersonalizedRoom = (io, socket) => {
  
  
  socket.on('join-room', ({ roomId, userName, userId, isAdmin }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: [], messages: [] });
    }

    const room = rooms.get(roomId);
    
    const existingUserIndex = room.users.findIndex(user => user.userId === userId);
    if (existingUserIndex === -1) {
      const newUser = { userId, userName, socketId: socket.id, isAdmin: isAdmin || false };
      room.users.push(newUser);

      const joinMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender: 'System',
        type: 'system',
        message: `${userName} joined the chat`,
        timestamp: new Date(),
        userId: 'system'
      };
      
      room.messages.push(joinMessage);
      io.to(roomId).emit('new-message', joinMessage);
    } else {
      // Update existing user's socket ID (reconnection)
      room.users[existingUserIndex].socketId = socket.id;
    }

    const onlineUsers = room.users.map(user => ({
      userId: user.userId,
      userName: user.userName,
      isAdmin: user.isAdmin
    }));

    io.to(roomId).emit('online-users-updated', {
      users: onlineUsers,
      totalOnline: onlineUsers.length
    });

    socket.emit('chat-history', room.messages);

    console.log(`User ${userName} joined room ${roomId}. Total users: ${room.users.length}`);
  });

  socket.on('send-message', ({ roomId, message, sender, userId, type = 'user' }) => {
    const room = rooms.get(roomId);
    if (!room) {
      console.log(`Room ${roomId} not found`);
      return;
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender,
      type,
      message,
      timestamp: new Date(),
      userId
    };

    room.messages.push(newMessage);
    io.to(roomId).emit('new-message', newMessage);

    console.log(`Message sent in room ${roomId} by ${sender}: ${message}`);
  });


  // 🔥 FIX 3: Use adminUserId instead of adminId for consistency
  socket.on('remove-user', ({ roomId, targetUserId, adminUserId }) => {
    const room = rooms.get(roomId);
    if (!room) {
      console.log(`Room ${roomId} not found`);
      return;
    }

    // 🔥 FIX: Check adminUserId instead of adminId
    const adminUser = room.users.find(user => user.userId === adminUserId && user.isAdmin);
    if (!adminUser) {
      console.log(`User ${adminUserId} is not authorized to remove users`);
      return;
    }

    const userIndex = room.users.findIndex(user => user.userId === targetUserId);
    if (userIndex === -1) {
      console.log(`User ${targetUserId} not found in room ${roomId}`);
      return;
    }

    const removedUser = room.users[userIndex];
    room.users.splice(userIndex, 1);

    const targetSocket = io.sockets.sockets.get(removedUser.socketId);
    if (targetSocket) {
      targetSocket.leave(roomId);
      targetSocket.emit('removed-from-room', { roomId });
    }

    const removeMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'System',
      type: 'system',
      message: `${removedUser.userName} was removed from the chat`,
      timestamp: new Date(),
      userId: 'system'
    };

    room.messages.push(removeMessage);
    io.to(roomId).emit('new-message', removeMessage);

    const onlineUsers = room.users.map(user => ({
      userId: user.userId,
      userName: user.userName,
      isAdmin: user.isAdmin
    }));

    io.to(roomId).emit('online-users-updated', {
      users: onlineUsers,
      totalOnline: onlineUsers.length
    });

    console.log(`User ${removedUser.userName} removed from room ${roomId} by admin ${adminUser.userName}`);
  });



  // 🔥 FIX 4: Add adminUserId verification for end-meeting
  socket.on('end-meeting', ({ roomId, adminUserId }) => {
    const room = rooms.get(roomId);
    if (!room) {
      console.log(`Room ${roomId} not found`);
      return;
    }

    // 🔥 FIX: Verify using adminUserId instead of socket.id
    const adminUser = room.users.find(user => user.userId === adminUserId && user.isAdmin);
    if (!adminUser) {
      console.log(`User ${adminUserId} is not authorized to end meeting`);
      return;
    }

    io.to(roomId).emit('meeting-ended', { roomId });
    
    room.users.forEach(user => {
      const userSocket = io.sockets.sockets.get(user.socketId);
      if (userSocket) {
        userSocket.leave(roomId);
      }
    });

    rooms.delete(roomId);

    console.log(`Meeting ended in room ${roomId} by admin ${adminUser.userName}`);
  });



  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    
    for (const [roomId, room] of rooms.entries()) {
      const userIndex = room.users.findIndex(user => user.socketId === socket.id);
      if (userIndex !== -1) {
        const leavingUser = room.users[userIndex];
        room.users.splice(userIndex, 1);

        const leaveMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sender: 'System',
          type: 'system',
          message: `${leavingUser.userName} left the chat`,
          timestamp: new Date(),
          userId: 'system'
        };
        
        room.messages.push(leaveMessage);
        io.to(roomId).emit('new-message', leaveMessage);

        const onlineUsers = room.users.map(user => ({
          userId: user.userId,
          userName: user.userName,
          isAdmin: user.isAdmin
        }));

        io.to(roomId).emit('online-users-updated', {
          users: onlineUsers,
          totalOnline: onlineUsers.length
        });

        console.log(`User ${leavingUser.userName} left room ${roomId}. Remaining users: ${room.users.length}`);

        if (room.users.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted - no users remaining`);
        }
        break;
      }
    }
  });



  socket.on('leave-room', ({ roomId, userId }) => {
  const room = rooms.get(roomId);
  if (!room) return;

  const userIndex = room.users.findIndex(u => u.userId === userId);
  if (userIndex !== -1) {
    const leavingUser = room.users[userIndex];
    room.users.splice(userIndex, 1);

    // Broadcast message
    const leaveMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'System',
      type: 'system',
      message: `${leavingUser.userName} left the chat`,
      timestamp: new Date(),
      userId: 'system'
    };
    room.messages.push(leaveMessage);
    io.to(roomId).emit('new-message', leaveMessage);

    // Update online users list
    const onlineUsers = room.users.map(user => ({
      userId: user.userId,
      userName: user.userName,
      isAdmin: user.isAdmin
    }));

    io.to(roomId).emit('online-users-updated', {
      users: onlineUsers,
      totalOnline: onlineUsers.length
    });

    console.log(`${leavingUser.userName} manually left room ${roomId}`);
  }
});

};