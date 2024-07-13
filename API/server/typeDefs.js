const typeDefs = `#graphql
    type Task {
        id: ID
        taskName: String!
    }

    type Query {
        tasks: [Task!]
    }

    type Mutation {
        insertTask(
            taskName: String!
        ): Task!

        updateTask(
            id: Int
            taskName: String
        ): [Task]

        deleteTask(
            id: Int!
        ): [Task!]
    }
`;

module.exports = typeDefs;