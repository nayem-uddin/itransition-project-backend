const cryptoJS = require("crypto-js");
require("dotenv").config();

function destructureProps(adminInfo) {
  const { fullName, username, email, password } = adminInfo;
  return { fullName, username, email, password };
}

function getSelectedIDs(list) {
  return list.map((item) => item.id);
}

function encrypt(password) {
  const passEncrypted = cryptoJS.HmacSHA512(password, process.env.SECRET_KEY);
  return passEncrypted.toString();
}

function filterQuestion(question) {
  const { type } = question;
  if (type !== "integer") {
    ["max", "min"].forEach((key) => delete question[key]);
  }
  if (!["radio", "checkbox"].includes(type)) {
    delete question["options"];
  }
}

function aggregate(question) {
  const answers = question.answers.map((answer) => answer.answer);
  const { type } = question;
  filterQuestion(question);
  let answerStat, populars;
  const { options } = question;
  switch (type) {
    case "integer":
      const total = answers.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue),
        0
      );
      const average = total / question.answersCount;
      Object.assign(question, { average });
      break;
    case "checkbox":
      answerStat = options.map((option) =>
        answers.reduce(
          (frequency, answer) => frequency + Number(answer.includes(option)),
          0
        )
      );
      populars = options.toSorted(
        (option1, option2) =>
          answerStat[options.indexOf(option1)] -
          answerStat[options.indexOf(option2)]
      );
      Object.assign(question, {
        mostChosenThree: populars.reverse().slice(0, 3),
      });
      break;
    case "radio":
      answerStat = options.map((option) =>
        answers.reduce(
          (frequency, answer) => frequency + Number(answer === option),
          0
        )
      );
      populars = options.toSorted(
        (option1, option2) =>
          answerStat[options.indexOf(option1)] -
          answerStat[options.indexOf(option2)]
      );
      Object.assign(question, {
        mostChosenThree: populars.reverse().slice(0, 3),
      });
      break;
    default:
      break;
  }
  return question;
}

function getCleanTemplate(templateData) {
  const dataValues = templateData.get({ plain: true });
  const result = dataValues.Questions.map(aggregate);
  return { ...dataValues, Questions: result };
}

const CASCADE = "CASCADE";
const frontEndUrl = [
  "https://itransition-project-frontend.vercel.app",
  "http://localhost:5173",
  "https://itransition-project-frontend-kkygkel9c.vercel.app",
];

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
  }
}
module.exports = {
  destructureProps,
  getSelectedIDs,
  encrypt,
  CASCADE,
  frontEndUrl,
  CustomError,
  aggregate,
  getCleanTemplate,
};
