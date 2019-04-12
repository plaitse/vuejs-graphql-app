# 1-apollo

GraphQL stands for Graph Query Language. It's a pattern for working with data. Rather than traditional route, we work with functions to fetch and return data. We often install Apollo - a set of tools such as an interface - which makes using GraphQL very to use within a project.

## Example of a query

```js
{
  getTodos {
    task
    completed
  }
}
```

## Example of a mutation

```js
mutation {
  addTodo(
    task: "This is a test"
    completed: false) {
    task
    completed
  }
}
```
