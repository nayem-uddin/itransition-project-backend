const {
  getTags,
  getTopics,
  getAllUsers,
  createTemplate,
  getAllTemplates,
  getCreatedTemplates,
  updateTemplate,
} = require("./handleDB/handleQueries");
const { frontEndUrl } = require("./handleDB/utilities");
const { validateUserAccess, validateTemplate } = require("./middleware");
const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: frontEndUrl,
    credentials: true,
  },
});
io.listen(4000);
console.log("socket-io running at 4000");
async function sendAllTemplates() {
  const templates = await getAllTemplates();
  io.emit("send-templates", { templates });
}

async function sendCreatedTemplates(socket, userId) {
  const templates = await getCreatedTemplates(userId);
  socket.emit("get-created-templates", { templates });
}

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

module.exports = { sendAllTemplates, sendCreatedTemplates, io };
