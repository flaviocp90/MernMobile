const authResolvers = require("./Auth");
const tasklistResolvers = require("./TaskList");
const todoResolvers = require("./Todo");

module.exports = {
  Query: {
    ...tasklistResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...tasklistResolvers.Mutation,
    ...todoResolvers.Muattion,
  },
  User: {
    ...authResolvers.User
  },
  TaskList: {
    ...tasklistResolvers.TaskList,
  },
  ToDo: {
    ...todoResolvers.ToDo,
  },
};
