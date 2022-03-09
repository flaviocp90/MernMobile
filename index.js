const { ApolloServer, gql } = require("apollo-server");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

dotenv.config();

const typeDefs = gql`
  type Query {
    myTaskLists: [TaskList!]!
  }

  type Mutation {
    signUp(input: SignUpInput): AuthUser!
    signIn(input: SignInInput): AuthUser!
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
    avatar: String!
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
    myTaskLists: () => [],
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
      const id = result.insertedId;
      const user = await db.collection("Users").findOne({ _id: id });
      return {
        user,
        token: "token",
      };
    },
    signIn: async(_, {input}, {db}) => {
      const user = await db.collection("Users").findOne({email: input.email})
      if(!user){
        throw new Error('Invalid credentials')
      }

      const isPasswordIsCorrect = bcrypt.compareSync(input.password, user.password)
      if(!isPasswordIsCorrect){
        throw new Error('Invalid credentials')
        
      }
      return {
        user,
        token: "token",
      }
    },
  },

  User: {
    id: ({_id, id}) => {
      return _id || id;
    },
  },
};

const start = async () => {
  const client = new MongoClient(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(process.env.DB_NAME);

  const context = {
    db,
  };

  const server = new ApolloServer({ typeDefs, resolvers, context });
  try {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
