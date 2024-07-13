const express = require("express");
const { dbConnection, resolvers } = require("./db");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const typeDefs = require("./typeDefs");

app.get("/", (req, res) => {
    res.send("Server Started Successfully.")
});

// db Connection
dbConnection();

// Starting apollo server to use graphql API
const { ApolloServer } = require("apollo-server-express");

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

server.start().then(() => {
    server.applyMiddleware({ app, path: "/graphql" });
});

app.listen(PORT, () => {
    console.log(`Application Server is running on http://localhost:${PORT}/`);
})