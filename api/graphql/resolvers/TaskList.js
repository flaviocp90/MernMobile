const { ObjectId } = require("mongodb");

module.exports = {
  Query: {
    myTaskLists: async (_, __, { db, user }) => {
      return await db
        .collection("TaskList")
        .find({ userIds: user._id })
        .toArray();
    },
    getTaskList: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error. Please sign in");
      }
      return await await db
        .collection("TaskList")
        .findOne({ _id: ObjectId(id) });
    },
  },
  Mutation: {
    createTaskList: async (_, { title }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error. Please sign in");
      }

      const newTaskList = {
        title,
        createdAt: new Date().toISOString(),
        userIds: [user._id],
      };

      const result = await db.collection("TaskList").insertOne(newTaskList);
      const task = await db
        .collection("TaskList")
        .findOne({ _id: result.insertedId });

      return task;
    },

    addUserToTaskList: async (_, { taskListId, userId }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error. Please sign in");
      }

      const taskList = await db
        .collection("TaskList")
        .findOne({ _id: ObjectId(taskListId) });
      if (!taskList) {
        return null;
      }
      if (
        taskList.userIds.find((dbId) => dbId.toString() === userId.toString())
      ) {
        return taskList;
      }
      await db.collection("TaskList").updateOne(
        {
          _id: ObjectId(taskListId),
        },
        {
          $push: {
            userIds: ObjectId(userId),
          },
        }
      );
      taskList.userIds.push(ObjectId(userId));
      return taskList;
    },

    updateTaskList: async (_, { id, title }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error. Please sign in");
      }
      const result = await db.collection("TaskList").updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: {
            title,
          },
        }
      );
      return await db.collection("TaskList").findOne({ _id: ObjectId(id) });
    },

    deleteTaskList: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error. Please sign in");
      }
      await db.collection("TaskList").deleteOne({ _id: ObjectId(id) });
      return true;
    },
  },
  TaskList: {
    id: ({ _id, id }) => _id || id,
    progress: async ({ _id }, _, { db }) => {
      const todos = await db
        .collection("ToDo")
        .find({ taskListId: ObjectId(_id) })
        .toArray();
      const completed = todos.filter((todo) => todo.isCompleted == true);

      if (todos.length === 0) {
        return 0;
      }
      return (100 * completed.length) / todos.length;
    },
    users: async ({ userIds }, _, { db }) =>
      Promise.all(
        userIds.map((userIds) =>
          db.collection("Users").findOne({ _id: ObjectId(userIds) })
        )
      ),
    todos: async ({ _id }, _, { db }) =>
      await db
        .collection("ToDo")
        .find({ taskListId: ObjectId(_id) })
        .toArray(),
  },
  User: {
    id: ({ _id, id }) => _id || id,
  },
};
