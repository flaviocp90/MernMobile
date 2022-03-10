const { ApolloServer, gql } = require("apollo-server");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
dotenv.config();

const getToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7 days" });

const getUserFromToken = async (token, db) => {
  if (!token) {
    return null;
  }
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenData?.id) {
    return null;
  }
  return await db.collection("Users").findOne({ _id: ObjectId(tokenData.id) });
};

const typeDefs = gql`
  type Query {
    myTaskLists: [TaskList!]!
    getTaskList(id: ID!): TaskList
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthUser!
    signIn(input: SignInInput!): AuthUser!

    createTaskList(title: String!): TaskList!
    updateTaskList(id: ID!, title: String!): TaskList!
    deleteTaskList(id: ID!): Boolean!
    addUserToTaskList(taskListId: ID!, userId: ID!): TaskList!

    createToDo(content: String!, taskListId: ID!): ToDo!
    updateToDo(id: ID!, content: String, isCompleted: Boolean): ToDo!
    deleteToDo(id: ID!): Boolean!
  }

  input SignUpInput {
    email: String!
    password: String!
    name: String!
    avatar: String
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type AuthUser {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type TaskList {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!

    users: [User!]!
    todos: [ToDo!]!
  }

  type ToDo {
    id: ID!
    content: String!
    isCompleted: Boolean!

    taskList: TaskList
  }
`;

const resolvers = {
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
    signUp: async (_, { input }, { db }) => {
      const hashedPassword = bcrypt.hashSync(input.password);
      const newUser = {
        ...input,
        password: hashedPassword,
      };
      // Save data into database
      const result = await db.collection("Users").insertOne(newUser);
      const user = await db
        .collection("Users")
        .findOne({ _id: result.insertedId });

      return {
        user,
        token: getToken(user),
      };
    },

    signIn: async (_, { input }, { db }) => {
      const user = await db.collection("Users").findOne({ email: input.email });
      const isPasswordIsCorrect =
        user && bcrypt.compareSync(input.password, user.password);
      if (!user || !isPasswordIsCorrect) {
        throw new Error("Invalid credentials");
      }

      return {
        user,
        token: getToken(user),
      };
    },

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

    createToDo: async (_, { content, taskListId }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error. Please sign in");
      }
      const newToDo = {
        content,
        taskListId: ObjectId(taskListId),
        isCompleted: false,
      };
      const result = await db.collection("ToDo").insertOne(newToDo);
      const toDo = await db
        .collection("ToDo")
        .findOne({ _id: result.insertedId });

      return toDo;
    },

    updateToDo: async (_, data, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error. Please sign in");
      }
      const result = await db.collection("ToDo").updateOne(
        {
          _id: ObjectId(data.id),
        },
        {
          $set: data
        }
      );
      return await db.collection("ToDo").findOne({ _id: ObjectId(data.id) });
    },

    deleteToDo: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error. Please sign in");
      }
      await db.collection("ToDo").deleteOne({ _id: ObjectId(id) });
      return true;
    },
  },

  User: {
    id: ({ _id, id }) => {
      return _id || id;
    },
  },
  TaskList: {
    id: ({ _id, id }) => _id || id,
    progress: () => 0,
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
  ToDo: {
    id: ({ _id, id }) => _id || id,
    taskList: async ({ taskListId }, _, { db }) =>
      await db.collection("ToDo").findOne({ _id: ObjectId(taskListId) }),
  },
};

const start = async () => {
  const client = new MongoClient(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(process.env.DB_NAME);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await getUserFromToken(req.headers.authorization, db);
      return {
        db,
        user,
      };
    },
  });
  try {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
