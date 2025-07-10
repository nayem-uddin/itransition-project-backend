const {
  getTags,
  getTopics,
  getAllUsers,
  getAllTemplates,
  getCreatedTemplates,
  getSentForms,
  getReceivedForms,
  handleLike,
  getComments,
} = require("./handleDB/handleQueries");
const { createServer } = require("http");
const { app } = require("./handleAPICalls");
const { frontEndUrl } = require("./utilities");
const { Server } = require("socket.io");
const { sequelize } = require("./handleDB/connectDB");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: frontEndUrl,
    credentials: true,
  },
});
httpServer.listen(5000, async () => {
  await sequelize.sync();
  console.log("server running at 5000");
});

io.on("connection", (socket) => {
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
  socket.on("request-templates", async () => {
    const templates = await getAllTemplates();
    io.emit("send-templates", { templates });
  });
  socket.on("request-created-templates", async (userId) => {
    const templates = await getCreatedTemplates(userId);
    socket.emit("get-created-templates", { templates });
  });
  socket.on("request-sent-forms", async (userId) => {
    const forms = await getSentForms(userId);
    io.emit("deliver-sent-forms", { forms });
  });
  socket.on("request-received-forms", async (templateId) => {
    const forms = await getReceivedForms(templateId);
    io.emit("deliver-received-forms", { forms });
  });
  socket.on("update-likes", async (templateId) => {
    const likes = await handleLike(templateId, 0);
    io.emit("deliver-likes", { likes });
  });
  socket.on("update-comments", async (templateId) => {
    const comments = await getComments(templateId);
    io.emit("deliver-comments", { comments });
  });
});
