const {
  User,
  Admin,
  Tag,
  Topic,
  Template,
  Question,
  Comment,
  Form,
  Answer,
} = require("./models");
const { destructureProps, getSelectedIDs, encrypt } = require("../utilities");
const { literal } = require("sequelize");

async function addComment(comment) {
  const newComment = await Comment.create(comment);
  return newComment;
}

async function addNewAdmins(users) {
  const usersInfo = users.map(destructureProps);
  const newAdmins = await Admin.bulkCreate(usersInfo);
  return newAdmins;
}

async function adminAccess(adminInfo) {
  const { password } = adminInfo;
  const passEncrypted = encrypt(password);
  const admin = await Admin.findOne({
    where: { ...adminInfo, password: passEncrypted },
  });
  return admin;
}

async function authenticate(userInfo) {
  const { password } = userInfo;
  const passEncrypted = encrypt(password);
  const user = await User.findOne({
    where: { ...userInfo, password: passEncrypted },
  });
  return user;
}

async function createTemplate(template) {
  const { tags } = template;
  const tagnames = tags.map((tag) => ({
    tagname: tag,
  }));
  await Tag.bulkCreate(tagnames, { ignoreDuplicates: true });
  const newTemplate = await Template.create(template, { include: [Question] });
  return newTemplate;
}

async function deleteAdmins(selectionList) {
  const selectedIDs = getSelectedIDs(selectionList);
  const admins = await Admin.destroy({ where: { id: selectedIDs } });
  return admins;
}

async function deleteComment(comm) {
  await Comment.destroy({ where: { id: comm.id } });
}

async function deleteQuestions(qIds) {
  await Question.destroy({ where: { id: qIds } });
  await Answer.destroy({ where: { QuestionId: null } });
}

async function deleteTemplates(templateIds) {
  await Template.destroy({ where: { id: templateIds } });
  await Form.destroy({ where: { TemplateId: null } });
  await Question.destroy({ where: { TemplateId: null } });
}

async function deleteUsers(selectionList) {
  const idList = getSelectedIDs(selectionList);
  await User.destroy({ where: { id: idList } });
  const nulUserId = { UserId: null };
  await Template.destroy({ where: nulUserId });
  await Comment.destroy({ where: nulUserId });
  await Form.destroy({ where: nulUserId });
}

async function getAdminsList() {
  const admins = await Admin.findAll();
  return admins;
}

async function getAllTemplates() {
  await Question.destroy({ where: { TemplateId: null } });
  const templates = await Template.findAll({
    include: [Question, { model: User, attributes: ["fullName"] }],
    attributes: {
      include: [
        [
          literal(
            `(
          SELECT COUNT(*)
          FROM forms
          WHERE forms.TemplateId=Template.id
          )`
          ),
          "formCount",
        ],
      ],
    },
    order: [["createdAt", "DESC"]],
  });
  return templates;
}

async function getAllUsers() {
  const users = await User.findAll();
  return users;
}

async function getCreatedTemplates(userId) {
  await Question.destroy({ where: { TemplateId: null } });
  const templates = await Template.findAll({
    where: { userId },
    include: [Question],
  });
  return templates;
}

async function getComments(TemplateId) {
  const comments = await Comment.findAll({
    where: { TemplateId },
    include: { model: User },
  });
  return comments;
}

async function getReceivedForms(TemplateId) {
  await Answer.destroy({ where: { formId: null } });
  const forms = await Form.findAll({
    where: { TemplateId },
    include: [
      { model: Template },
      { model: User, attributes: ["fullName"] },
      { model: Answer, include: Question },
    ],
  });
  return forms;
}

async function getSentForms(UserId) {
  await Answer.destroy({ where: { formId: null } });
  const forms = await Form.findAll({
    where: { UserId },
    include: [
      {
        model: Template,
        include: { model: User, attributes: ["fullName"] },
      },
      {
        model: Answer,
        include: Question,
      },
    ],
  });
  return forms;
}

async function getTags() {
  const tags = await Tag.findAll({ attributes: ["tagname"] });
  return tags.map((tag) => tag.tagname);
}

async function getTopics() {
  const topics = await Topic.findAll({ attributes: ["topic"] });
  return topics.map((topic) => topic.topic);
}

async function handleLike(id, increment) {
  await Template.increment({ likes: increment }, { where: { id } });
  const template = await Template.findByPk(id, { attributes: ["likes"] });
  return template.likes;
}

async function recordResponse(form) {
  const [record, created] = await Form.upsert(form);
  for (let answer of form.answers) {
    await Answer.upsert({ ...answer, formId: record.id });
  }
  return record;
}

async function register(userInfo) {
  const { password } = userInfo;
  const passEncrypted = encrypt(password);
  const user = await User.create({ ...userInfo, password: passEncrypted });
  return user;
}

async function updateAdminStatus(selectionList, status) {
  const idList = getSelectedIDs(selectionList);
  const admins = await Admin.update({ status }, { where: { id: idList } });
  return admins;
}

async function updateComment(comm) {
  const { comment, id } = comm;
  const updatedComment = await Comment.update({ comment }, { where: { id } });
  return updatedComment;
}

async function updateTemplate(template) {
  const { id, Questions, ...templateFields } = template;
  const updatedTemplate = await Template.update(templateFields, {
    where: { id },
  });
  for (let q of Questions) {
    await Question.upsert({ ...q, TemplateId: id });
  }
  return updatedTemplate;
}

async function updateUserStatus(selectionList, status) {
  const idList = getSelectedIDs(selectionList);
  const users = await User.update({ status }, { where: { id: idList } });
  return users;
}

module.exports = {
  register,
  authenticate,
  adminAccess,
  getAdminsList,
  updateAdminStatus,
  deleteAdmins,
  addNewAdmins,
  getAllUsers,
  updateUserStatus,
  deleteUsers,
  getTags,
  getTopics,
  createTemplate,
  getAllTemplates,
  getCreatedTemplates,
  updateTemplate,
  recordResponse,
  getReceivedForms,
  getSentForms,
  handleLike,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  deleteTemplates,
  deleteQuestions,
};
