const { ApolloServer, gql } = require("apollo-server");

const todos = [
  { task: "Wash car", completed: false },
  { task: "Clean room", completed: true }
];

const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }
  type Query {
    getTodos: [Todo]
  }
  type Mutation {
    addTodo(task: String, completed: Boolean): Todo
  }
`;

const resolvers = {
  Query: {
    getTodos: () => todos
  },
  Mutation: {
    // addTodo: (_, args) => {
    //   const todo = { task: args.task, completed: args.completed };
    //   todos.push(todo);
    //   return todo;
    // }
    /* --- Other way --- */
    addTodo: (_, { task, completed }) => {
      const todo = { task, completed };
      todos.push(todo);
      return todo;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

// We can choose the port by passing it inside listen(8080)
server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
