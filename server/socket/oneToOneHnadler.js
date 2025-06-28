let waitingUsers = [];
let userRoomMap = new Map();

export const handleSocketConnection = (io, socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("ready-for-chat", (data) => {
    const user = data?.user;
    if (!user) {
      console.warn("⚠️ No user info sent from client. Skipping pairing.");
      return;
    }

    console.log("🕐 Ready for chat:", user.name, socket.id);

    const alreadyQueued = waitingUsers.some((entry) => entry.socket.id === socket.id);
    const alreadyPaired = userRoomMap.has(socket.id);

    if (!alreadyQueued && !alreadyPaired) {
      console.log("➕ Adding to waitingUsers:", user.name);
      waitingUsers.push({ socket, user });
    }

    if (waitingUsers.length >= 2) {
      const user1 = waitingUsers.shift();
      const user2 = waitingUsers.shift();

      if (user1.socket.id === user2.socket.id) {
        console.log("⚠️ Same user matched with self. Skipping.");
        return;
      }

      const roomId = `room-${user1.socket.id}-${user2.socket.id}`;
      user1.socket.join(roomId);
      user2.socket.join(roomId);

      userRoomMap.set(user1.socket.id, roomId);
      userRoomMap.set(user2.socket.id, roomId);

      console.log(`🔗 Paired ${user1.user.name} & ${user2.user.name} in ${roomId}`);

      user1.socket.emit("match-found", {
        roomId,
        partner: user2.user,
      });

      user2.socket.emit("match-found", {
        roomId,
        partner: user1.user,
      });
    }
  });

  socket.on("message", ({ roomId, text }) => {
    console.log(`💬 [${roomId}] ${socket.id} says:`, text);
    io.to(roomId).emit("message", {
      sender: socket.id,
      text,
    });
  });

  socket.on("leave-room", ({ roomId }) => {
    console.log(`👋 ${socket.id} is leaving room: ${roomId}`);
    socket.to(roomId).emit("partner-left");
    socket.leave(roomId);
    userRoomMap.delete(socket.id);

    for (let [id, room] of userRoomMap.entries()) {
      if (room === roomId) {
        console.log("🧹 Cleaning up other user in room:", id);
        userRoomMap.delete(id);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);

    const roomId = userRoomMap.get(socket.id);
    waitingUsers = waitingUsers.filter((entry) => entry.socket.id !== socket.id);
    userRoomMap.delete(socket.id);

    if (roomId) {
      console.log(`⚠️ Notifying others in ${roomId} that ${socket.id} disconnected`);
      socket.to(roomId).emit("partner-left");

      for (let [id, room] of userRoomMap.entries()) {
        if (room === roomId) {
          console.log("🧹 Cleaning up other user in room:", id);
          userRoomMap.delete(id);
        }
      }
    }
  });
};
