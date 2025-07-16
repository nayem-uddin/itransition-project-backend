const { DataTypes } = require("sequelize");
const { sequelize } = require("./connectDB");
const { CASCADE } = require("../utilities");

const User = sequelize.define(
  "User",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    version: true,
  }
);

const Admin = sequelize.define(
  "Admin",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    version: true,
  }
);

const Tag = sequelize.define(
  "Tag",
  {
    tagname: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

const Topic = sequelize.define(
  "Topic",
  {
    topic: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

const Template = sequelize.define("Template", {
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  coverImgLink: {
    type: DataTypes.STRING,
  },
  topic: {
    type: DataTypes.STRING,
  },
  accessibility: {
    type: DataTypes.STRING,
  },
  usersWithAccess: {
    type: DataTypes.JSON,
  },
  tags: {
    type: DataTypes.JSON,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

const Question = sequelize.define("Question", {
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  max: {
    type: DataTypes.INTEGER,
  },
  min: {
    type: DataTypes.INTEGER,
  },
  options: {
    type: DataTypes.JSON,
  },
  showOnPreview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Comment = sequelize.define("Comment", {
  comment: {
    type: DataTypes.STRING,
  },
});

const Form = sequelize.define("form");
const Answer = sequelize.define("answer", {
  answer: {
    type: DataTypes.JSON,
  },
});

Answer.belongsTo(Form);
Form.hasMany(Answer);
Answer.belongsTo(Question);
Question.hasMany(Answer);
Template.hasMany(Form);
Form.belongsTo(Template);
User.hasMany(Form);
Form.belongsTo(User);
Template.hasMany(Comment);
Comment.belongsTo(Template);
User.hasMany(Comment);
Comment.belongsTo(User);
Template.hasMany(Question);
Question.belongsTo(Template);
User.hasMany(Template);
Template.belongsTo(User);

module.exports = {
  User,
  Admin,
  Tag,
  Topic,
  Template,
  Question,
  Comment,
  Form,
  Answer,
};
