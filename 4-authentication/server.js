const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// Import environment variables and Mongoose models
require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");

// Import typeDefs and resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// Connect to MongoDB Atlas database
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true } // Use new url parser
  )
  .then(() => console.log("DB Connected"))
  .catch(err => {
    console.error({ err });
    console.log({ err });
  });

// Verify JWT token passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError(
        "Your session has ended. Please sign again."
      );
    }
  }
};

// Create Apollo/GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  }
});

// We can choose the port by passing it inside listen(8080)
server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
  console.log("URI : ", process.env.MONGO_URI);
});
