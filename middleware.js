const { default: rateLimit } = require("express-rate-limit");
const { Admin, User } = require("./handleDB/models");
const {
  recordResponse,
  deleteQuestions,
  updateTemplate,
  deleteTemplates,
} = require("./handleDB/handleQueries");

async function validateAdminAccess(req, res, next) {
  const adminInfo = await Admin.findOne({ where: { id: req.cookies.id } });
  if (adminInfo === null) {
    return res
      .status(404)
      .send({ message: "Your admin account doesn't exist" });
  }
  if (adminInfo.status === "blocked") {
    return res.status(403).send({ message: "Your account is blocked" });
  }
  next();
}

async function validateUserAccess(req, res, next) {
  const userInfo = await User.findOne({ where: { id: req.body.UserId } });
  if (userInfo === null) {
    return res.status(404).send({
      text: "Account doesn't exist or is deleted by an admin",
      type: "error",
    });
  }
  if (userInfo.status === "blocked") {
    return res
      .status(403)
      .send({ text: "Your account is blocked", type: "error" });
  }
  next();
}

function validateTemplate(req, res, next) {
  const template = req.body;
  const questions = template.Questions;
  const numOfEachType = ["string", "integer", "checkbox", "radio"].map((type) =>
    questions.reduce(
      (total, question) => total + Number(question.type === type),
      0
    )
  );
  if (numOfEachType.some((n) => n > 4)) {
    return res.status(400).send({
      text: "Only 4 questions of each type are allowed",
      type: "error",
    });
  }
  next();
}

function hasIds(req, res, next) {
  try {
    const ids = req.body.templateIds;
    if (ids.length === 0) {
      return res
        .status(400)
        .send({ text: "No template selected", type: "error" });
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function formInsertOrUpdate(req, res, next) {
  try {
    await recordResponse(req.body);
    res
      .status(200)
      .send({ text: "Response recorded successfully", type: "confirmation" });
  } catch (error) {
    next(error);
  }
}

async function templateDeletionRequest(req, res, next) {
  try {
    await deleteTemplates(req.body.templateIds);
    res
      .status(200)
      .send({ text: "Successfully deleted", type: "confirmation" });
  } catch (error) {
    next(error);
  }
}

async function questionsDeletionRequest(req, res, next) {
  try {
    const { selectedQuestions } = req.body;
    const parsedQuestions = selectedQuestions.map((q) => JSON.parse(q));
    const filteredQuestions = parsedQuestions.filter((q) => "id" in q);
    const qIds = filteredQuestions.map((q) => q.id);
    await deleteQuestions(qIds);
    return res
      .status(200)
      .send({ text: "Deleted successfully", type: "confirmation" });
  } catch (error) {
    next(error);
  }
}

async function templateUpdateRequest(req, res, next) {
  try {
    await updateTemplate(req.body);
    res
      .status(200)
      .send({ text: "Successfully updated", type: "confirmation" });
  } catch (error) {
    next(error);
  }
}

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  message: { message: "Too many requests. Please try again later" },
});

module.exports = {
  validateAdminAccess,
  validateUserAccess,
  limiter,
  validateTemplate,
  formInsertOrUpdate,
  templateDeletionRequest,
  hasIds,
  questionsDeletionRequest,
  templateUpdateRequest,
};
