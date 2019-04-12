const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");

const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

// We can choose the port by passing it inside listen(8080)
server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
  console.log("URI : ", process.env.MONGO_URI);
});
