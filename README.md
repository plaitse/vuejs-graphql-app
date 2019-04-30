# vuesjs-graphql-app

Full-stack JavaScript app using:

- VueJS
- Vuetify
- GraphQL
- Apollo
- Mongoose
- MongoDB Atlas

Available at this URL: https://vuejs-graphql.paulrblt.now.sh

## Heroku and Now settings

On Heroku's website, go to your project, click on the "Settings" tab and then on "Config Vars" and provide the content of `variables.env`.

On the project, go to the client folder:

- Edit the `main.js` file by providing the Heroku app URL `https://vuejs-graphql.herokuapp.com/` with `/graphql` at the end. Then, comment the line `import "@babel/polyfill";`.
- Install the following npm packages `graphql-tag graphql` to prevent errors occuring during deployment.
- Add a `now.json` file to deploy the VueJS app as a set of static files with the following content:

```json
{
  "version": 2,
  "name": "vue-share",
  "builds": [{ "src": "package.json", "use": "@now/static-build" }],
  "routes": [
    { "src": "^/js/(.*)", "dest": "/js/$1" },
    { "src": "^/css/(.*)", "dest": "/css/$1" },
    { "src": "^/img/(.*)", "dest": "/img/$1" },
    { "src": ".*", "dest": "/index.html" }
  ]
}
```

- Add the following script to the `package.json`: `"now-build": "npm run build"`.
- Install the `now` package globally: `sudo npm i -g --unsafe-perm now`.
- Run `now login` after you've set up your account on `zeit.co`.
- To deploy the app run `now` and copy the given URL at the end of the process `https://vuejs-graphql.paulrblt.now.sh`.

## To run each steps

Create a variables.env file at the root folder with the following content:

```html
MONGO_URI=mongodb+srv://useradmin:useradmin@vuejs-graphql-app-s9zga.mongodb.net/test?retryWrites=true
SECRET=12323JHDBZHD92NSD9JSDNJKD
```

The `/test` after mongodb.net refers to the database named "test".
