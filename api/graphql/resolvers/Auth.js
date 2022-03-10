const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const getToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7 days" });

module.exports = {
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
  },
  User: {
    id: ({ _id, id }) => _id || id,
  },
};
