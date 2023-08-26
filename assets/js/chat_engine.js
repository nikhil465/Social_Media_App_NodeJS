class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://18.119.135.55:5000");

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;
    this.socket.on("connect", function () {
      console.log("connection established using sockets...!");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatRoom: "codial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("a user joined", data);
      });
    });

    $(".send-button").click(function () {
      let msg = $("#chat-message-input").val();

      if (msg != "") {
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          chatRoom: "codial",
        });
      }
    });

    self.socket.on("receive_message", function (data) {
      console.log("message received ", data);

      let chatMessages = $(".chat-messages");

      const messageElement = $("<div>");
      messageElement.addClass("message");

      let user;
      if (data.user_email == self.userEmail) {
        messageElement.addClass("sent");
        user = "You";
      } else {
        messageElement.addClass("received");
        user = data.user_email;
      }

      const contentElement = $("<div>", {
        html: data.message,
      });
      contentElement.addClass("content");

      const senderElement = $("<div>", {
        html: user,
      });
      senderElement.addClass("sender");

      messageElement.append(senderElement);
      messageElement.append(contentElement);
      chatMessages.append(messageElement);
    });
  }
}
