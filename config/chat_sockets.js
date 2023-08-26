module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer, {
    cors: {
      methods: ["GET", "POST"],
    },
  });

  io.sockets.on("connection", function (socket) {
    console.log("new connection received", socket.id);

    socket.on("disconnect", function () {
      console.log("socket disconnected!");
    });

    socket.on("join_room", function (data) {
      console.log("Joiing request receive...", data);

      socket.join(data.chatRoom);

      io.in(data.chatRoom).emit("user_joined", data);
    });

    socket.on("send_message", function (data) {
      io.in(data.chatRoom).emit("receive_message", data);
    });
  });
};
