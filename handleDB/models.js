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

const Form = sequelize.define("form", {
  response: {
    type: DataTypes.JSON,
  },
});

Template.hasMany(Form, { onDelete: CASCADE });
Form.belongsTo(Template);
User.hasMany(Form);
Form.belongsTo(User, { onDelete: CASCADE });
Template.hasMany(Comment, {
  onDelete: CASCADE,
});
Comment.belongsTo(Template);
User.hasMany(Comment, {
  onDelete: CASCADE,
});
Comment.belongsTo(User);
Template.hasMany(Question, {
  onDelete: CASCADE,
});
Question.belongsTo(Template);
User.hasMany(Template, {
  onDelete: CASCADE,
});
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
};
