const {
  getTags,
  getTopics,
  getAllUsers,
  getAllTemplates,
  getCreatedTemplates,
} = require("./handleDB/handleQueries");
const { createServer } = require("http");
const { app } = require("./handleAPICalls");
const { frontEndUrl } = require("./handleDB/utilities");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: frontEndUrl,
    credentials: true,
  },
});
httpServer.listen(5000, () => {
  console.log("server running at 5000");
});

io.on("connection", (socket) => {
  socket.on("user-entry", (userId) => {
    socket.userId = userId;
    console.log(socket.userId + " is connected");
  });
  socket.on("request-users", async () => {
    const users = await getAllUsers();
    socket.emit("send-users", { users });
  });
  socket.on("request-tags", async () => {
    const tagnames = await getTags();
    socket.emit("send-tags", { tagnames });
  });
  socket.on("request-topics", async () => {
    const topics = await getTopics();
    socket.emit("send-topics", { topics });
  });
  socket.on("request-templates", () => {
    sendAllTemplates();
  });
  socket.on("request-created-templates", (userId) => {
    sendCreatedTemplates(socket, userId);
  });
});
async function sendAllTemplates() {
  if (!io) return;
  const templates = await getAllTemplates();
  io.emit("send-templates", { templates });
}
async function sendCreatedTemplates(socket, userId) {
  const templates = await getCreatedTemplates(userId);
  socket.emit("get-created-templates", { templates });
}
