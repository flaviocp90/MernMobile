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
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthUser!
    signIn(input: SignInInput!): AuthUser!

    createTaskList(title: String!): TaskList!
    updateTaskList(id: ID!, title: String!): TaskList!
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
      console.log(ObjectId(id))
      console.log(result)
      return await db.collection("TaskList").findOne({ _id: ObjectId(id) });
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
